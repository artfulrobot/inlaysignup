<?php
/**
 * Custom signup for Climate Visuals project.
 */

namespace Civi\Inlay;

use Civi\Inlay\Type as InlayType;
use Civi\Inlay\ApiRequest;
use Civi;
use CRM_Inlaysignup_ExtensionUtil as E;

class CoSignup extends InlayType {

  public static $typeName = 'Signup form';

  public static $defaultConfig = [
    'publicTitle'      => '',
    'introHTML'        => '',
    'submitButtonText' => 'Sign up',
    'webThanksHTML'    => NULL,
    'mailingGroup'     => NULL,
    'socials'          => ['twitter', 'facebook', 'email', 'whatsapp'],
    'socialStyle'      => 'col-buttons', // col-buttons|col-icon|'',
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
  public function getInitData():array {
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
      'socialStyle',
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
  public function processRequest(ApiRequest $request):array {

    $data = $this->cleanupInput($request->getBody());

    if (empty($data['token'])) {
      // Unsigned request. Issue a token that will be valid in 5s time and lasts 2mins max.
      return ['token' => $this->getCSRFToken(['data' => $data, 'validFrom' => 5, 'validTo' => 120])];
    }

    $groupID = (int) $this->config['mailingGroup'];
    $data += ['welcomeEmailID' => $this->config['welcomeEmailID']];

    $i = \Civi\LocalFluentImport::ofClean($data);
    $i->getOrCreateContact(['first_name', 'last_name', 'email'])
      ->ensureEmailNotOnHold('email')
      ->coStoreCountry($i->getCleanValue('countryISO2Code'))
      ->addToGroup($groupID)
      ->coStoreConsent($groupID,
        '<p>Signed up using Signup Inlay ' . htmlspecialchars($this->getName()) . '</p>',
        $i->getInputValue('origin'))
        ;

    $i->ifClean('welcomeEmailID')->coSendEmail($i->getCleanValue('welcomeEmailID'));
    $i->ifClean('organisation')->updateContact(['Individuals_details.Declared_Organisation' => $i->getCleanValue('organisation')]);

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

    // origin is the URL of the page that the script is on.
    $valid['origin'] = trim($data['origin']);
    if (!preg_match('@^https?://@', $valid['origin'])) {
      $valid['origin'] = '';
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
    if (preg_match('@^(n[/. ]a[.]?|none|unemployed|x+)$@i', $valid['organisation'])) {
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
  public function getExternalScript() :string {
    return file_get_contents(E::path('dist/inlay-signup-a.js'));
  }

}

