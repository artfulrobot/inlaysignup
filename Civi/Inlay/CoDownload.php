<?php

namespace Civi\Inlay;

use Civi\Inlay\Type as InlayType;
use Civi\Inlay\ApiRequest;
use Civi;
use CRM_Inlaysignup_ExtensionUtil as E;

class CoDownload extends InlayType {

  const ACTIVITY_TYPE_ID_DOWNLOAD=56;
  const ACTIVITY_TYPE_ID_FOLLOWUP=90;

  public static $typeName = 'Datawalled Download';

  public static $defaultConfig = [
    'buttonText'            => 'Download',
    'webThanksHTML'         => NULL,
    'questionText'          => NULL,
    'followupText'          => NULL,
    'smallprintHTML'        => NULL,
    'followupMaps'          => [['reportTitle' => 'default', 'messageTplID' => NULL]],
    'followupMessageFromID' => NULL, /* actually it's "value" */
  ];

  /**
   * Note: because of the way CRM.url works, you MUST put a ? before the #
   *
   * @var string
   */
  public static $editURLTemplate = 'civicrm/a?#/inlays/codownload/{id}';

  /**
   * Generates data to be served with the Javascript application code bundle.
   *
   * @return array
   */
  public function getInitData() :array {
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
  public function processRequest(ApiRequest $request) :array {

    $data = $this->cleanupInput($request->getBody());

    if (empty($data['token'])) {
      // Unsigned request. Issue a token that will be valid in 5s time and lasts 2mins max.
      return ['token' => $this->getCSRFToken(['data' => $data, 'validFrom' => 5, 'validTo' => 120])];
    }


    // Generate the HTML for the download activity.
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

    $i = \Civi\LocalFluentImport::ofClean($data);
    $i->getOrCreateContact(['first_name', 'last_name', 'email']);
    $i->ifClean('organisation')->updateContact(['Individuals_details.Declared_Organisation' => $i->getCleanValue('organisation')]);
    $i->addActivity([
      'activity_type_id'  => self::ACTIVITY_TYPE_ID_DOWNLOAD,
      'subject'           => $data['reportTitle'],
      'details'           => $details,
    ], 'downloadActivity');

    //\CRM_Gdpr_SLA_Utils::recordSLAAcceptance($contactID);

    if ($this->config['followupText'] && $data['followup'] === 'Yes') {

      $status = 'Scheduled';
      $followupAlteration = '+2 months';
      if ($data['reportTitle'] === 'Britain Talks COP26') {
        $followupAlteration = '+5 weeks';
      }
      elseif ($data['reportTitle'] === 'Engaging different audiences around COP26: a guide for UK-based climate advocates') {
        $followupAlteration = '+5 weeks';
      }
      elseif ($data['reportTitle'] === 'Climate Outreach - Natural England - Nature visuals') {
        $status = 'Cancelled';
      }

      $date = $this->getSuitableFollowupDate(NULL, $followupAlteration);
      $i->addActivity([
        'parent_id'          => $i->getContextValue(['downloadActivity', 'id']),
        'activity_date_time' => $date,
        'activity_type_id'   => self::ACTIVITY_TYPE_ID_FOLLOWUP,
        'subject'            => "Follow up: " . $data['reportTitle'],
        'status_id:name'     => $status,
        'details'            => '<p>This scheduled activity means that on its date an automatic email will be sent to this contact to follow up on the report. Which followup gets sent depends on the configuration at the time.</p><p>You can cancel this follow up by deleting this activity.</p>',
      ]);
    }

    return [ 'success' => 1 ];
  }

  /**
   * Validate and clean up input data.
   *
   * @param array $data
   * - first_name
   * - last_name
   * - email
   * - questionResponse
   * - followup
   * - location
   * - reportTitle
   * - organisation (optional)
   * - token (sent on 2nd request, for validation)
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
        // xxx ts todo
        $errors[] = str_replace('_', ' ', $field) . " required.";
      }
      else {
        if ($field === 'email' && !filter_var($val, FILTER_VALIDATE_EMAIL)) {
          // xxx ts
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
   * Get the Javascript app script.
   *
   * This will be bundled with getInitData() and some other helpers into a file
   * that will be sourced by the client website.
   *
   * @return string Content of a Javascript file.
   */
  public function getExternalScript() :string {
    return file_get_contents(E::path('dist/inlay-coDownload.js'));
  }

  public function sendFollowup(Array $activity, $targetContactID) {

    preg_match('/^Follow up: (.*)$/', $activity['subject'], $matches);
    $messageTemplateID = $this->config['followupMaps'][0]['messageTplID'] ?? NULL;
    if (!$messageTemplateID) {
      throw new \InvalidArgumentException("No default message template configured for followup report inlay");
    }
    // find the specific message tpl id, if there is one.
    if (!empty($matches[1])) {
      // Find the report title in the map.
      foreach ($this->config['followupMaps'] as $item) {
        if ($item['reportTitle'] === $matches[1]) {
          // Found!
          $messageTemplateID = $item['messageTplID'];
          break;
        }
      }
    }

    // Fetch the name and title of the message template. This also checks it exists.
    $msgTpl = civicrm_api3('MessageTemplate', 'getsingle', ['return' => ['msg_title', 'msg_subject'], 'id' => $messageTemplateID]);

    // send the email.
    // Get the From address.
    // By default, use default values.
    list($fromName, $fromEmail) = \CRM_Core_BAO_Domain::getNameAndEmail(TRUE);
    if ($this->config['followupMessageFromID']) {
      // Try to load the specified entry.
      $combined = \Civi\Api4\OptionValue::get(FALSE)
        ->setCheckPermissions(FALSE)
        ->addSelect('label')
        ->addWhere('option_group_id:name', '=', 'from_email_address')
        ->addWhere('is_active', '=', TRUE)
        ->addWhere('value', '=', (int) $this->config['followupMessageFromID'])
        ->execute()->first()['label'] ?? NULL;
      if (!empty($combined)) {
        // Nothing configured, or loading the configured address failed.
        // Load default.
        $_ = \CRM_Utils_Mail::pluckEmailFromHeader($combined);
        if ($_) {
          $fromEmail = $_;
        }
        $_ = explode('"', $combined);
        if (!empty($_[1])) {
          $fromName = $_[1];
        }
      }
    }

    // Load the target contact.
    $emailApiParams = [
      'create_activity' => 0,
      'template_id'     => $messageTemplateID,
      'activity_id'     => $activity['id'],
      'contact_id'      => $targetContactID,
      'disable_smarty'  => 1,
      'subject'         => $activity['subject'],
      'from_email'      => $fromEmail,
      'from_name'       => $fromName,
    ];
    Civi::log()->info("Sending email with: " . json_encode($emailApiParams, JSON_PRETTY_PRINT));
    $result = civicrm_api3('Email', 'send', $emailApiParams);

    // Update the activity to Completed.
    $activityUpdateParams = [
      'activity_id'        => $activity['id'],
      'activity_status_id' => 'Completed',
      'details'            => '<p>Sent message template titled <em>'
        . htmlspecialchars($msgTpl['msg_title'])
        . '</em> with subject <em>'
        . htmlspecialchars($msgTpl['msg_subject'])
        . '</em> at ' . date('H:i j M Y') .  '</p>',
    ];
    civicrm_api3('Activity', 'create', $activityUpdateParams);

  }
  /**
   * Get a date 2 months hence, but move it forward if it's a weekend or holiday. Also skip the Christmas period.
   *
   * @return ?string parsable date string or NULL for now
   * @return string date in Y-m-d format
   */
  public function getSuitableFollowupDate($from=NULL, string $followupAlteration = '+2 months') {
    if ($from === NULL) {
      $from = 'today';
    }
    $cache = \CRM_Utils_Cache::create(['type' => ['SqlGroup'], 'name' => 'codownload']);
    $bankHolls = $cache->get('bankHolls', NULL); // Will return default if cached value expired.
    if (!$bankHolls) {
      $data = json_decode(file_get_contents('https://www.gov.uk/bank-holidays.json'), TRUE);
      if ($data) {
        // Success,
        $bankHolls = [];
        foreach ($data as $division => $_) {
          foreach ($_['events'] as $holiday) {
            $bankHolls[$holiday['date']] = 1;
          }
        }
        // cache for a month.
        $cache->set('bankHolls', $bankHolls, new \DateInterval('P1M')); // Keep value for 1 month.
      }
    }

    $d = new \DateTime($from);
    $d->modify($followupAlteration);
    // Avoid Xmas.
    $_ = $d->format('m-d');
    $y = $d->format('Y');
    if ($_ > '12-18') {
      $d->setDate($y + 1, 1, 12);
    }
    elseif ($_ < '01-12') {
      $d->setDate($y, 1, 12);
    }

    // Avoid weekends, holidays.
    while (array_key_exists($d->format('Y-m-d'), $bankHolls) || $d->format('N') > 5) {
      $d->modify('+1 day');
    }
    return $d->format('Y-m-d 10:00:00');
  }
}
