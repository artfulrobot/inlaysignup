<?php

namespace Civi\Inlay;

use Civi\Inlay\Type as InlayType;
use Civi\Inlay\ApiRequest;
use Civi;
use CRM_Inlaysignup_ExtensionUtil as E;
use CRM_Sos_JourneyLogic;

class SignupA extends InlayType {

  public static $typeName = 'Signup form A';

  public static $defaultConfig = [
    'publicTitle'      => '',
    'submitButtonText' => 'Send',
    'smallprintHTML'   => NULL,
    'webThanksHTML'    => NULL,
    'phoneAsk'         => TRUE,
    'mailingGroup'     => NULL,
    'target'           => NULL,
    'socials'          => ['twitter', 'facebook', 'email', 'whatsapp'],
    'socialStyle'      => 'col-buttons', // col-buttons|col-icon|'',
    'tweet'            => '',
    'whatsappText'     => '',
    //'defaultMessage'   => NULL,
    //'instructionsHTML' => '',
    //'assignee'         => NULL,
    // 'notifyEmail'      => NULL,
  ];

  /**
   * Note: because of the way CRM.url works, you MUST put a ? before the #
   *
   * @var string
   */
  public static $editURLTemplate = 'civicrm/a?#/inlays/signupA/{id}';

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
    foreach (['socialStyle', 'submitButtonText', 'publicTitle', 'smallprintHTML', 'webThanksHTML', 'instructionsHTML', // 'phoneAsk'
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

    // Count people signed up...
    // @todo
    if (!empty($this->config['mailingGroup'])) {
      // Count people in this group.
      $groupID = (int) $this->config['mailingGroup'];
      $data['count'] = (int) \CRM_Core_DAO::singleValueQuery("
        SELECT COUNT(*)
        FROM civicrm_group_contact gc
        INNER JOIN civicrm_contact c ON gc.contact_id = c.id AND c.is_deleted = 0
        WHERE gc.group_id = $groupID AND gc.status = 'Added'
        ");
    }
    else {
      Civi::log()->notice("No mailing group configured for whole earth");
      $data['count'] = 0;
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

    /*
    // Find Contact with XCM.
    $params = $data + ['contact_type' => 'Individual'];
    $contactID = civicrm_api3('Contact', 'getorcreate', $params)['id'] ?? NULL;
    if (!$contactID) {
      Civi::log()->error('Failed to getorcreate contact with params: ' . json_encode($params));
      throw new \Civi\Inlay\ApiException(500, ['error' => 'Server error: XCM1']);
    }
     */

    // Process their journey. THIS IS COMPLETELY CUSTOM
    $journeyParams = $data + [
      'journey_action' => 'whole_earth_signup',
      'group_id'       => (int) $this->config['mailingGroup'],
    ];
    CRM_Sos_JourneyLogic::processApiRequest($journeyParams);


    return ['success' =>1];
    return ['error' => 'unfinished'];
    // Require 'contactform1' form processor.
    try {
      $formProcessor = civicrm_api3('FormProcessorInstance', 'getsingle', [
        'name' => 'contactform1',
      ]);
    }
    catch (\Exception $e) {
      Civi::log()->error('Failed to find "contactform1" FormProcessorInstance', ['exception' => $e]);
      throw new \Civi\Inlay\ApiException(500, ['error' => 'Server error: ICF1']);
    }

    // Verbose list of data for clarity.
    $fpData = [
      'email'      => $data['email'],
      'first_name' => $data['first_name'],
      'last_name'  => $data['last_name'],
    ];
    /*
    if ($this->config['phoneAsk'] && !empty($data['phone'])) {
      $fpData['phone'] = $data['phone'];
    }
     */

    // Create the activity details.
    $fpData['activity_subject'] = $this->getName() . " (website contact form)";
    $fpData['activity_details'] = "<p>We received the following message:</p>\n<blockquote><p>"
      . preg_replace('/[\r\n]+/', '</p><p>', htmlspecialchars($data['message']))
      . '</p></blockquote><p>Details provided:</p><ul>';
    foreach (['email', 'first_name', 'last_name', 'phone'] as $_) {
      if ($_) {
        $fpData['activity_details'] .= '<li>' . ucfirst(str_replace('_', ' ', $_)) . ': ' . htmlspecialchars($data[$_]) . '</li>';
      }
    }
    $fpData['activity_details'] .= '</ul>';
    $fpData['activity_details'] .= '<pre>'  . htmlspecialchars(json_encode($data, JSON_PRETTY_PRINT)) . '</pre>';

    // Use the Form Processor to process it.
    $result = civicrm_api3('FormProcessor', 'contactform1', $fpData);

    // @todo email activity

    return [ 'success' => 1 ];
  }

  /**
   * Validate and clean up input data.
   *
   * Possible outputs:
   * - first_name
   * - last_name
   * - email
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

      // Validation that is more expensive, and for fields where invalid data
      // would likely represent misuse of the form is done now - after the
      // token check, to avoid wasting server resources on spammers trying to
      // randomly post to the endpoint.

      /*
      if ($this->config['phoneAsk'] && !empty($data['phone'])) {
        // Check the phone.
        $valid['phone'] = preg_replace('/[^0-9+]/', '', $data['phone']);
      }
       */
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
   * Custom function to get unis.
   *
   * @return array contact ID => university name
   */
  public function getUnis($checkID=NULL) {
    $unis = [];

    $api = \Civi\Api4\Contact::get(FALSE)
      ->addSelect('legal_name', 'id')
      ->addWhere('contact_type', '=', 'Organization')
      ->addWhere('contact_sub_type', 'IN', ['ACIHECollege', 'ACIUniversity'])
      ->addWhere('is_deleted', '=', FALSE)
    ;
    if ($checkID) {
      $api->addWhere('id', '=', $checkID);
    }
    $result = $api
      ->addOrderBy('legal_name', 'ASC')
      ->execute();

    foreach ($result as $uni) {
      $unis[] = ['id' => $uni['id'], 'name' => $uni['legal_name']];
    }

    return $unis;
  }
}

