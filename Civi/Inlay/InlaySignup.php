<?php

namespace Civi\Inlay;

use Civi\Inlay\Type as InlayType;
use Civi;
use CRM_Inlaysignup_ExtensionUtil as E;

class InlaySignup extends InlayType {

  public const PROCESS_EVENT = 'civi.inlaysignup.process';

  public static $typeName = 'Pop-up Signup form';

  public static $defaultConfig = [
    'title'            => 'Sign up',
    'introHTML'        => NULL,
    'submitButtonText' => 'Sign up',
    'smallprintHTML'   => NULL,
    'webThanksHTML'    => NULL,
    'minScrollPercent' => 40,
    'notBefore'        => 10,
    'cookieExpiryDays' => 90,
    'customCSS'        => '',
    'notWhenUrlIs'     => '',
    'modal'            => FALSE,

    'mailingGroup'     => NULL,
    'welcomeEmailID'   => NULL,
  ];

  /**
   * Note: because of the way CRM.url works, you MUST put a ? before the #
   *
   * @var string
   */
  public static $editURLTemplate = 'civicrm/a?#/inlays/signup/{id}';

  /**
   * Generates data to be served with the Javascript application code bundle.
   *
   * @return array
   */
  public function getInitData(): array {
    return [
      // Name of global Javascript function used to boot this app.
      'init'             => 'inlaySignupInit',
      'title'            => $this->config['title'],
      'introHTML'        => $this->config['introHTML'],
      'submitButtonText' => $this->config['submitButtonText'],
      'smallprintHTML'   => $this->config['smallprintHTML'],
      'webThanksHTML'    => $this->config['webThanksHTML'],
      'notBefore'        => $this->config['notBefore'],
      'minScrollPercent' => $this->config['minScrollPercent'],
      'customCSS'        => $this->config['customCSS'],
      'notWhenUrlIs'     => $this->config['notWhenUrlIs'],
      'modal'            => $this->config['modal'],
      'cookieExpiryDays' => $this->config['cookieExpiryDays'],
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
  public function processRequest(ApiRequest $request): array {

    $data = $this->cleanupInput($request->getBody());

    if (empty($data['token'])) {
      // Unsigned request. Issue a token that will be valid in 5s time and lasts 2mins max.
      return ['token' => $this->getCSRFToken(['data' => $data, 'validFrom' => 5, 'validTo' => 120])];
    }

    // Allow modification of the processing chain.
    // Each callback in the chain is called with callback(array $data, \Civi\Inlay\Type $inlay)
    $event = \Civi\Core\Event\GenericHookEvent::create([
      'chain' => [
        // The following must set contactID on the data array
        'findOrCreate'        => [$this, 'findOrCreateWithXCM'],

        'setBulkOnGivenEmail' => [$this, 'setBulkOnGivenEmail'],
        'addContactToGroup'   => [$this, 'addContactToGroup'],
        'sendWelcomeEmail'    => [$this, 'sendWelcomeEmail'],
      ],
      'inlay' => $this,
    ]);
    // Allow extensions to alter the processing chain.
    // They may completely change $event->chain, e.g.
    // $event->chain = [function($data, $inlay) { ... }]
    // Or may choose to override/remove/add bits as they wish.
    \Civi::dispatcher()->dispatch(static::PROCESS_EVENT, $event);

    // Process the chain.
    foreach ($event->chain as $callback) {
      $callback($data, $this);
    }

    return ['success' => 1];
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

    // Loosely validate source against angle brackets.
    $valid['source'] = mb_substr(trim($data['source'] ?? ''), 0, 255);
    if ($valid['source'] && !preg_match('@^[^<>]+$@', $valid['source'])) {
      $valid['source'] = '';
      $errors[] = "Invalid request (this should not happen) SRC1";
    }
    // Store raw source in case useful.
    $valid['sourceRaw'] = $data['source'] ?? '';

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
        Civi::log()->notice("Token error: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        throw new \Civi\Inlay\ApiException(
          400,
          ['error' => "Mysterious problem, sorry! Code " . substr($e->getMessage(), 0, 3)]
              );
      }
    }

    return $valid;
  }

  /**
   * Default find-or-create functionality.
   *
   * Sets $data['contactID']
   */
  public function findOrCreateWithXCM(array &$data) {
    $params = $data + ['contact_type' => 'Individual'];
    $contactID = civicrm_api3('Contact', 'getorcreate', $params)['id'] ?? NULL;
    if (!$contactID) {
      Civi::log()->error('Failed to getorcreate contact with params: ' . json_encode($params));
      throw new \Civi\Inlay\ApiException(500, ['error' => 'Server error: XCM1']);
    }
    $data['contactID'] = $contactID;
  }

  /**
   */
  public function setBulkOnGivenEmail($data) {
    \Civi\Api4\Email::update(FALSE)
      ->addWhere('email', '=', $data['email'])
      ->addWhere('contact_id', '=', $data['contactID'])
      ->addValue('is_bulkmail', TRUE)
      ->setLimit(1)
      ->execute();
  }

  public function addContactToGroup($data) {
    $groupID = $this->config['mailingGroup'];
    if ($groupID) {
      $contactIDs = [$data['contactID']];
      // list($total, $added, $notAdded) = \CRM_Contact_BAO_GroupContact::addContactsToGroup($contactIDs, $groupID, 'Web', 'Added');
      \CRM_Contact_BAO_GroupContact::addContactsToGroup($contactIDs, $groupID, 'Web', 'Added');
    }
  }

  public function sendWelcomeEmail(array $data) {
    if (!$this->config['welcomeEmailID']) {
      // Not configured to send an email.
      return;
    }

    try {
      $template = civicrm_api3('MessageTemplate', 'get', [
        'id'         => $this->config['welcomeEmailID'],
        'sequential' => 1,
        'return'     => 'id,msg_title',
      ]);
      if ($template['count'] != 1) {
        throw new \RuntimeException("Failed to find email message template specified in InlaySignup " . ($this->instanceData['name']));
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
        'to_email'   => $data['email'],
        'contact_id' => $data['contactID'],
        'disable_smarty' => 1,
        //'bcc'        => "you@example.org", // so I can keep an eye.
        //'template_params' => []
      ];

      $mailingInfo = Civi::settings()->get('mailing_backend');
      if ($mailingInfo['outBound_option'] == \CRM_Mailing_Config::OUTBOUND_OPTION_DISABLED) {
        Civi::log()->warning("Mail disabled. Otherwise would send mailing $template[id]");
        $details = "Message NOT sent: mailer backend is disabled - eg. development mode";
        $status = 'Cancelled';
      }
      else {
        civicrm_api3('MessageTemplate', 'send', $msgTplSendParams);
        $details = "<p>Message successfully sent</p>";
        $status = 'Completed';
      }
    }
    catch (\Exception $e) {
      $error = __CLASS__ . "::" . __FUNCTION__ . ":ERROR: failed to send mailing. Error:" . $e->getMessage();
      if (isset($msgTplSendParams)) {
        $error .= " MessageTemplate.send params were: " . json_encode($msgTplSendParams);
      }
      Civi::log()->error($error);

      $details = "<p>Message failed to send - see error log. Exception: " . htmlspecialchars($e->getMessage()) . "</p>";
      $status = 'Cancelled';
    }

    // Record that the email was(/not) sent.
    civicrm_api3('Activity', 'create', [
      'source_contact_id' => \CRM_Core_BAO_Domain::getDomain()->contact_id,
      'target_id'         => $data['contactID'],
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
  public function getExternalScript(): string {
    return file_get_contents(E::path('dist/inlay-signup-popup.js'));
  }

}
