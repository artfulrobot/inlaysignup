<?php

namespace Civi\Inlay;

use Civi\Inlay\Type as InlayType;
use Civi\Inlay\ApiRequest;
use Civi;
use CRM_Inlaysignup_ExtensionUtil as E;

class InlaySignup extends InlayType {

  public static $typeName = 'Signup form';

  public static $defaultConfig = [
    'signupButtonText' => 'Sign up',
    'smallprintHTML'   => NULL,
    'mailingGroup'     => NULL,
    'welcomeEmailID'   => NULL,
    'webThanksHTML'    => NULL,
  ];

  /**
   * Note: because of the way CRM.url works, you MUST put a ? before the #
   *
   * @var string
   */
  public static $editURLTemplate = 'civicrm/a?#/inlays/signup/{id}';

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
    return [
      // Name of global Javascript function used to boot this app.
      'init'             => 'inlaySignupInit',
      'signupButtonText' => $this->config['signupButtonText'],
      'webThanksHTML'    => $this->config['webThanksHTML'],
      'smallprintHTML'   => $this->config['smallprintHTML'],
    ];
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
      throw new \Civi\Inlay\ApiException(500, 'Server error: XCM1');
    }

    // Ensure this email is their Bulk Mail one.
    $result = \Civi\Api4\Email::update(FALSE)
      ->addWhere('email', '=', $data['email'])
      ->addWhere('contact_id', '=', $contactID)
      ->addValue('is_bulkmail', TRUE)
      ->setLimit(1)
      ->execute();

    // Add to group.
    $groupID = $this->config['mailingGroup'];
    list($total, $added, $notAdded) = \CRM_Contact_BAO_GroupContact::addContactsToGroup([$contactID], $groupID, 'Web', 'Added');

    // Record consent.
    $emailConsentGroup = \Civi\Api4\Group::get(FALSE)
        ->addSelect('id')
        ->addWhere('name', '=', 'consent_all_email')
        ->execute()
        ->first()['id'] ?? NULL;
    if (!$emailConsentGroup) {
      list($total, $added, $notAdded) = \CRM_Contact_BAO_GroupContact::addContactsToGroup([$contactID], $emailConsentGroup, 'Web', 'Added');
    }
    else {
      Civi::log()->error("Failed to find consent_all_email Group; was going to add contact $contactID into it as they signed up.");
    }
    \CRM_Gdpr_SLA_Utils::recordSLAAcceptance($contactID);
    \CRM_Gdpr_CommunicationsPreferences_Utils::createCommsPrefActivity($contactID, ['activity_source' => "Subscribed via InlaySignup '" . htmlspecialchars($this->instanceData['name']) . "'"]);

    // @todo make PR for adding source elsewhere than details (which is a big text blob that can't be indexed.)
    // Also, possibly see CRM_Gdpr_CommunicationPrefs_Utils::updateCommsPrefByFormValues($contactID, $submittedValues)
    // but it's crude and does not allow for a subset of groups.

    // Send welcome mailing.
    $this->sendWelcomeEmail($contactID);

    return [ 'success' => 1 ];
  }

  /**
   * Validate and clean up input data.
   *
   * @param array $data
   *
   * @return array
   */
  public function cleanupInput($data) {
    $errors = [];
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
    if ($errors) {
      throw new \Civi\Inlay\ApiException(400, implode(', ', $errors));
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
        watchdog('inlay', $e->getMessage() . "\n" . $e->getTraceAsString, array(), WATCHDOG_ERROR);
        throw new \Civi\Inlay\ApiException(400,
          "Mysterious problem, sorry! Code " . substr($e->getMessage(), 0, 3));
      }
    }


    return $valid;
  }

  public function sendWelcomeEmail($contactID) {
    if (!$this->config['welcomeEmailID']) {
      return;
    }

    try {
      $template = civicrm_api3('MessageTemplate', 'get', [
        'id'         => $this->config['welcomeEmailID'],
        'sequential' => 1,
        'return'     => 'id, msg_title',
      ]);
      if ($template['count'] != 1) {
        throw new \RuntimeException("Failed to find email message template specified in InlaySignup " . ($this->instanceData['name']));
      }
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
    return file_get_contents(E::path('dist/bundle.js'));
  }

}
