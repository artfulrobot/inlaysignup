<?php
/**
 * Custom signup for Climate Visuals project.
 */

namespace Civi\Inlay;

use Civi\Inlay\Type as InlayType;
use Civi\Inlay\ApiRequest;
use Civi;
use CRM_Inlaysignup_ExtensionUtil as E;
use CRM_Sos_JourneyLogic;

class CoSignup extends InlayType {

  public static $typeName = 'Signup form';

  public static $defaultConfig = [
    'publicTitle'      => '',
    'introHTML'        => '',
    'submitButtonText' => 'Sign up',
    'webThanksHTML'    => NULL,
    'mailingGroup'     => NULL,
    'socials'          => ['twitter', 'facebook', 'email', 'whatsapp'],
    'tweet'            => '',
    'whatsappText'     => '',
    'welcomeEmailID'   => NULL,
    //'assignee'         => NULL, xxx
    // 'smallprintHTML'   => NULL,
    // 'phoneAsk'         => TRUE,
  ];

  /**
   * Note: because of the way CRM.url works, you MUST put a ? before the #
   *
   * @var string
   */
  public static $editURLTemplate = 'civicrm/a?#/inlays/CoSignup/{id}';

  /**
   * Sets the config ensuring it's valid.
   *
   * This implementation simply ensures all the defaults exist, and that no
   * other keys exist, but you could do other things, especially if you need to
   * coerce some old config into a new style.
   *
   * @param array $config
   *
   * @return \Civi\Inlay\Type (this)
   */
  public function setConfig(array $config) {
    $this->config = array_intersect_key($config + static::$defaultConfig, static::$defaultConfig);
  }

  /**
   * Generates data to be served with the Javascript application code bundle.
   *
   * @return array
   */
  public function getInitData() {
    $data = [
      // Name of global Javascript function used to boot this app.
      'init'             => 'inlaySignupAInit',
    ];
    foreach ([
      'publicTitle',
      'introHTML',
      'submitButtonText',
      // 'smallprintHTML',
      'webThanksHTML',
      //'instructionsHTML', // 'phoneAsk'
    ] as $_) {
      $data[$_] = $this->config[$_] ?? '';
    }

    $data['socials'] = [];
    foreach ($this->config['socials'] as $social) {
      $_ = ['name' => $social];
      if ($social === 'twitter') {
        $_['tweet'] = $this->config['tweet'];
      }
      elseif ($social === 'whatsapp') {
        $_['whatsappText'] = $this->config['whatsappText'];
      }
      $data['socials'][] = $_;
    }

    // Provide list of countries, keyed by ISO code.
    $countries = \Civi\Api4\Country::get(FALSE)
      ->setCheckPermissions(FALSE)
      ->addSelect('iso_code', 'name')
      ->execute();
    $data['countries'] = [];
    foreach ($countries as $_) {
      $data['countries'][] = [$_['iso_code'], $_['name']];
    }

    return $data;
  }

  /**
   * Process a request
   *
   * Request data is just key, value pairs from the form data. If it does not
   * have 'token' field then a token is generated and returned. Otherwise the
   * token is checked and processing continues.
   *
   * @param \Civi\Inlay\Request $request
   * @return array
   *
   * @throws \Civi\Inlay\ApiException;
   */
  public function processRequest(ApiRequest $request) {

    $data = $this->cleanupInput($request->getBody());

    if (empty($data['token'])) {
      // Unsigned request. Issue a token that will be valid in 5s time and lasts 2mins max.
      return ['token' => $this->getCSRFToken(['data' => $data, 'validFrom' => 5, 'validTo' => 120])];
    }

    // Find Contact with XCM.
    $params = $data + ['contact_type' => 'Individual'];
    $contactID = civicrm_api3('Contact', 'getorcreate', $params)['id'] ?? NULL;
    if (!$contactID) {
      Civi::log()->error('Failed to getorcreate contact with params: ' . json_encode($params));
      throw new \Civi\Inlay\ApiException(500, ['error' => 'Server error: XCM1']);
    }

    // Record Organisation.
    $this->storeOrg($contactID, $data['organisation']);

    // Record Country.
    $this->storeCountry($contactID, $data['countryISO2Code']);

    // Add to mailing list.
    $groupID = $this->config['mailingGroup'];
    $contactIDs = [$contactID];
    list($total, $added, $notAdded) = \CRM_Contact_BAO_GroupContact::addContactsToGroup($contactIDs, $groupID, 'Web', 'Added');

    // Record consent.
    $this->storeConsent($contactID, $data);

    // Send welcome
    $this->sendWelcomeEmail($contactID, $data);

    return ['success' =>1];
  }

  /**
   * Validate and clean up input data.
   *
   * Possible outputs:
   * - first_name
   * - last_name
   * - email
   * - countryISO2Code (ISO code like GB)
   * - organisation (may be empty)
   * - token TRUE|unset
   *
   * @param array $data
   *
   * @return array
   */
  public function cleanupInput($data) {
    /** @var Array errors in this array, it will later be converted to a string. */
    $errors = [];
    /** @var Array Collect validated data in this array */
    $valid = [];

    // Check we have what we need.
    foreach (['first_name', 'last_name', 'email'] as $field) {
      $val = trim($data[$field] ?? '');
      if (empty($val)) {
        $errors[] = str_replace('_', ' ', $field) . " required.";
      }
      else {
        if ($field === 'email' && !filter_var($val, FILTER_VALIDATE_EMAIL)) {
          $errors[] = "invalid email address";
        }
        else {
          $valid[$field] = $val;
        }
      }
    }

    // Country is required.
    $countryISO2Code = $data['country'] ?? 'GB';
    // Is it valid?
    if (civicrm_api3('Country', 'get', ['iso_code' => $countryISO2Code])['count'] != 1) {
      $errors[] = 'Invalid country given';
    }
    else {
      $valid['countryISO2Code'] = $countryISO2Code;
    }

    // Organisation.
    $valid['organisation'] = trim($data['organisation'] ?? '');
    if (preg_match('@^(n[/. ]a[.]?|none|unemployed|x+)$@i')) {
      // Looks like user had to enter something to get passed validation. Skip it.
      $valid['organisation'] = '';
    }

    // Stop now if there's any basic validation errors.
    if ($errors) {
      throw new \Civi\Inlay\ApiException(400, ['error' => implode(', ', $errors)]);
    }

    // Data is valid.
    if (!empty($data['token'])) {
      // There is a token, check that now.
      try {
        $this->checkCSRFToken($data['token'], $valid);
        $valid['token'] = TRUE;
      }
      catch (\InvalidArgumentException $e) {
        // Token failed. Issue a public friendly message, though this should
        // never be seen by anyone legit.
        Civi::log()->notice("Token error: " . $e->getMessage . "\n" . $e->getTraceAsString());
        throw new \Civi\Inlay\ApiException(400,
          ['error' => "Mysterious problem, sorry! Code " . substr($e->getMessage(), 0, 3)]);
      }
    }

    return $valid;
  }

  /**
   * Returns a URL to a page that lets an admin user configure this Inlay.
   *
   * @return string URL
   */
  public function getAdminURL() {

  }

  /**
   * Get the Javascript app script.
   *
   * This will be bundled with getInitData() and some other helpers into a file
   * that will be sourced by the client website.
   *
   * @return string Content of a Javascript file.
   */
  public function getExternalScript() {
    return file_get_contents(E::path('dist/inlay-signup-a.js'));
  }

  /**
   */
  protected function storeCountry(int $contactID, string $countryISO2Code) {

    // Load the contact's Main address.
    $result = civicrm_api3('Address', 'get', [
      'sequential' => 1,
      'contact_id' => $contactID,
      'is_primary' => 1,
      'return'     => ["country_id.iso_code"],
    ]);
    $needToAddAddress = FALSE;
    if ($result['count']) {
      if (($result['values'][0]['country_id.iso_code'] ?? 'GB') === $countryISO2Code) {
        // Nothing to do.
      }
      else {
        // Different country code.
        // Expire this address, add new one.
        civicrm_api3('Address', 'create', [
          'id'               => $result['values'][0]['id'],
          'location_type_id' => "Previous",
        ]);
        $needToAddAddress = TRUE;
      }
    }
    else {
      // No address found.
      $needToAddAddress = TRUE;
    }
    if ($needToAddAddress) {
      civicrm_api3('Address', 'create', [
        'contact_id'       => $contactID,
        'location_type_id' => "Main",
        'is_primary'       => 1,
        'country_id'       => $countryISO2Code,
      ]);
    }

  }

  /**
   * Simple/crude store as current_employer
   */
  protected function storeOrg($contactID, $organisationName) {
    if (!$organisationName) {
      return;
    }
    $current = civicrm_api3('Contact', 'getsingle', ['id' => $contactID, 'return' => ['current_employer']])['current_employer'] ?? '';
    if ($current !== $organisationName) {
      civicrm_api3('Contact', 'create', ['id' => $contactID, 'current_employer' => $organisationName]);
    }
  }
  protected function storeConsent(int $contactID, Array $data) {

    // Look up the name of the mailing list.
    $groupID = $this->config['mailingGroup'];
    $groupName = Civi\Api4\Group::get(FALSE)
      ->setCheckPermissions(FALSE)
      ->addWhere('id', '=', $groupID)
      ->execute()
      ->first()['title'];

    // Record consent activity.
    $result = civicrm_api3('Activity', 'create', [
      'source_contact_id' => $contactID,
      'target_id'         => $contactID,
      'activity_type_id'  => "Consent",
      'subject'           => "Signed up to $groupName",
      'status_id'         => 'Completed',
      // 'location'          => $this->request_body->source ?? '',
      'details'           => "<p>Signed up to mailing list(s): " . htmlspecialchars($groupName) . " using the Signup Inlay called <em>"
                             . htmlspecialchars($this->getName()) . '</em><p>',
    ]);

  }
  public function sendWelcomeEmail($contactID, $valid) {
    if (!$this->config['welcomeEmailID']) {
      return;
    }

    try {
      $template = civicrm_api3('MessageTemplate', 'get', [
        'id'         => $this->config['welcomeEmailID'],
        'sequential' => 1,
        'return'     => 'id,msg_title',
      ]);
      if ($template['count'] != 1) {
        throw new \RuntimeException("Failed to find email message template specified in CoSignup inlay " . ($this->getName()));
      }
      $template = $template['values'][0];
      $from = civicrm_api3('OptionValue', 'getvalue', [
        'return'          => "label",
        'option_group_id' => "from_email_address",
        'is_default'      => 1,
      ]);
      $msgTplSendParams = [
        'id'         => $template['id'],
        'from'       => $from,
        'to_email'   => $valid['email'],
        'contact_id' => $contactID,
        'disable_smarty' => 1,
        //'bcc'        => "forums@artfulrobot.uk", // so I can keep an eye.
        //'template_params' => []
      ];

      $mailingInfo = Civi::settings()->get('mailing_backend');
      if ($mailingInfo['outBound_option'] == \CRM_Mailing_Config::OUTBOUND_OPTION_DISABLED) {
        Civi::log()->warning("Mail disabled. Otherwise would send mailing $template[id]");
        $details = "Message NOT sent: mailer backend is disabled - eg. development mode";
        $status = 'Cancelled';
      }
      else {
        $result = civicrm_api3('MessageTemplate', 'send', $msgTplSendParams);
        $details = "<p>Message successfully sent</p>";
        $status = 'Completed';
      }

    }
    catch (Exception $e) {
      $error = __CLASS__ . "::" . __FUNCTION__ . ":ERROR: failed to send mailing. Error:"  . $e->getMessage();
      if (isset($msgTplSendParams)) {
        $error .= " MessageTemplate.send params were: " . json_encode($msgTplSendParams);
      }
      Civi::log()->error($error);

      $details = "<p>Message failed to send - see Sos error log. Exception: " . htmlspecialchars($e->getMessage()) . "</p>";
      $status = 'Cancelled';
    }

    // Record that the email was(/not) sent.
    $result = civicrm_api3('Activity', 'create', [
      'source_contact_id' => \CRM_Core_BAO_Domain::getDomain()->contact_id,
      'target_id'         => $contactID,
      'activity_type_id'  => "Email",
      'subject'           => "Sent Email '" . $template['msg_title'] . "'",
      'status_id'         => $status,
      'details'           => $details,
    ]);
  }
}

