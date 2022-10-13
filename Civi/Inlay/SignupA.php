<?php

namespace Civi\Inlay;

use Civi\Inlay\Type as InlayType;
use Civi\Inlay\ApiRequest;
use Civi;
use CRM_Inlaysignup_ExtensionUtil as E;
use CRM_Sos_JourneyLogic;

class SignupA extends InlayType {

  public static $typeName = 'SOS custom signup forms';

  public static $defaultConfig = [
    'publicTitle'             => '',
    'submitButtonText'        => 'Send',
    'smallprintHTML'          => NULL,
    'webThanksHTML'           => NULL,
    'phoneAsk'                => TRUE,
    'mailingGroup'            => NULL,
    'target'                  => NULL,
    'socials'                 => ['twitter', 'facebook', 'email', 'whatsapp'],
    'socialStyle'             => 'col-buttons', // col-buttons|col-icon|'',
    'tweet'                   => '',
    'whatsappText'            => '',
    'preFormHTML'             => '',
    'postFormHTML'            => '',
    'newsletterLabelText'     => '',
    'thanksMessageTemplateID' => NULL,
    'defaultJourneyStep'      => 'S1', // Chassé
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
   * Generates data to be served with the Javascript application code bundle.
   *
   * @return array
   */
  public function getInitData() :array {
    $data = [
      // Name of global Javascript function used to boot this app.
      'init'             => 'inlaySignupAInit',
    ];
    foreach (['socialStyle', 'submitButtonText', 'publicTitle', 'smallprintHTML', 'webThanksHTML', 'instructionsHTML', // 'phoneAsk'
      'preFormHTML', 'postFormHTML', 'newsletterLabelText'
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
    /*
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
    }
     */
    // Not used.
    $data['count'] = 0;

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
  public function processRequest(ApiRequest $request) :array {

    $data = $this->cleanupInput($request->getBody());

    if (empty($data['token'])) {
      // Unsigned request. Issue a token that will be valid in 2s time and lasts 2mins max.
      return ['token' => $this->getCSRFToken(['data' => $data, 'validFrom' => 2, 'validTo' => 120])];
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

    $customCode = [
              '5612e1ca4e8a' => 'whole_earth_signup',
              //'6c471fba10bf' => 'bath_bomb_soundscape_form',
      ][$this->getPublicID()] ?? 'custom_signup_inlay';

    $journeyParams = $data + [
      'journey_action'     => $customCode, // ugly hack
      'inlay_name'         => $this->getName(),
      'group_id'           => (int) $this->config['mailingGroup'],
      'msg_tpl_id'         => (int) $this->config['thanksMessageTemplateID'],
      'defaultJourneyStep' => $this->config['defaultJourneyStep'] ?? '',
    ];
    Civi::log()->info('SOS SignupA journey params ' . json_Encode($journeyParams));
    CRM_Sos_JourneyLogic::processApiRequest($journeyParams);

    return ['success' =>1];
  }

  /**
   * Validate and clean up input data.
   *
   * Possible outputs:
   * - first_name
   * - last_name
   * - email
   * - newsletterCheckbox
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

    // Handle checkbox.
    Civi::log()->info('SOS SignupA ' . json_Encode(['configVal' => $this->config['newsletterLabelText'], 'data' => $data]));
    if ($this->config['newsletterLabelText']) {
      $valid['newsletterCheckbox'] = (bool) (($data['newsletterCheckbox'] ?? FALSE));
      Civi::log()->info('SOS SignupA here');
    }
    else {
      // If we did not offer a checkbox, the whole form is an opt-in.
      $valid['newsletterCheckbox'] = TRUE;
      Civi::log()->info('SOS SignupA there');
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
  public function getExternalScript() :string {
    return file_get_contents(E::path('dist/inlay-signup-sos.js'));
  }


}

