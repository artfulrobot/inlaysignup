<?php

namespace Civi\Inlay;

use Civi\Inlay\Type as InlayType;
use Civi\Inlay\ApiRequest;
use Civi;
use CRM_Inlaysignup_ExtensionUtil as E;

class CoDownload extends InlayType {

  public static $typeName = 'Datawalled Download';

  public static $defaultConfig = [
    'buttonText' => 'Download',
    //'mailingGroup'     => NULL,
    //'welcomeEmailID'   => NULL,
    'webThanksHTML'    => NULL,
    'questionText' => NULL,
    'followupText' => NULL,
    'smallprintHTML'   => NULL,
  ];

  /**
   * Note: because of the way CRM.url works, you MUST put a ? before the #
   *
   * @var string
   */
  public static $editURLTemplate = 'civicrm/a?#/inlays/codownload/{id}';

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
      'init'           => 'inlayCoDownloadInit',
      'questionText'   => $this->config['questionText'],
      'followupText'   => $this->config['followupText'],
      'smallprintHTML' => $this->config['smallprintHTML'],
      'buttonText'     => $this->config['buttonText'],
      'webThanksHTML'  => $this->config['webThanksHTML'],
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
      throw new \Civi\Inlay\ApiException(500, ['error' => 'Server error: XCM1']);
    }
    // Update current_employer if organisation given.
    if (($data['organisation'] ?? '')) {
      $params = ['id' => $contactID, 'current_employer' => $data['organisation']];
      civicrm_api3('Contact', 'create', $params);
    }

    //\CRM_Gdpr_SLA_Utils::recordSLAAcceptance($contactID);
    // @todo record download activity
    $downloadActivityTypeID = 56;

    $htmlSafe = [];
    foreach ($data as $k => $v) {
      $htmlSafe[$k] = $v;
    }
    $htmlSafe['organisation'] = $htmlSafe['organisation'] ?? '';
    $config = [];
    $config['questionText'] = htmlspecialchars($this->config['questionText']);
    $config['followupText'] = htmlspecialchars($this->config['followupText']);
    $details = <<<HTML
      <p>$htmlSafe[first_name] $htmlSafe[last_name] $htmlSafe[email] downloaded from <a href="$htmlSafe[location]" >$htmlSafe[location]</a> <em>$htmlSafe[organisation]</em></p>
      $config[questionText]
      <blockquote>$htmlSafe[questionResponse]</blockquote>
      $config[followupText]
      <p>They chose: <em>$htmlSafe[followup]</em></p>
HTML;

    $downloadActivityID = civicrm_api3('Activity', 'create', [
      'source_contact_id' => $contactID,
      'target_id'         => $contactID,
      'activity_type_id'  => $downloadActivityTypeID,
      'subject'           => $data['reportTitle'],
      'status_id'         => 'Completed',
      'details'           => $details,
    ])['id'];

    if ($data['followup'] === 'Yes') {
      $date = strtotime('today + 1 month');
      // 10am seems reasonable. At least if they're in our timezone...
      $date = date('Y-m-d 10:00:00', $date);
      $result = civicrm_api3('Activity', 'create', [
        'parent_id'          => $downloadActivityID,
        'source_contact_id'  => $contactID,
        'activity_date_time' => $date,
        'target_id'          => $contactID,
        'activity_type_id'   => $downloadActivityTypeID,
        'subject'            => "Follow up: " . $data['reportTitle'],
        'status_id'          => 'Scheduled',
        'details'            => '<p>If this activity is scheduled, then on its date an automatic email will be sent to this contact to follow up on the report. If this activity is Completed, that email has been sent.</p><p>If scheduled, you can cancel this follow up by deleting this activity.</p>',
      ]);
    }

    return [ 'success' => 1 ];
  }

  /**
   * Validate and clean up input data.
   *
   * @param array $data
   *
   * @return array of acceptable data
   */
  public function cleanupInput($data) {
    $errors = [];
    $valid = [];
    Civi::log()->info("data received:" . json_encode($data));
    // Check we have what we need.
    foreach (['first_name', 'last_name', 'email', 'questionResponse', 'followup', 'location', 'reportTitle'] as $field) {
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
    // Optional field(s)
    foreach (['organisation'] as $field) {
      $val = trim($data[$field] ?? '');
      if ($val) {
        $valid[$field] = $val;
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
        // Civi::log()->notice("Token error: " . $e->getMessage . "\n" . $e->getTraceAsString());
        watchdog('inlay', $e->getMessage() . "\n" . $e->getTraceAsString, array(), WATCHDOG_ERROR);
        throw new \Civi\Inlay\ApiException(400,
          ['error' => "Mysterious problem, sorry! Code " . substr($e->getMessage(), 0, 3)]);
      }
    }


    // Civi::log()->info("valid data received:" . json_encode($valid));
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
    return file_get_contents(E::path('dist/inlay-coDownload.js'));
  }

}
