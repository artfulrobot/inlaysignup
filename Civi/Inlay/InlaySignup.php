<?php

namespace Civi\Inlay;

use Civi\Inlay\Type as InlayType;

class InlaySignup extends InlayType {

  public static $typeName = 'Signup form';

  public static $defaultConfig = [
    'signupButtonText' => 'Sign up',
    'mailingGroup'     => NULL,
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
    $this->config = array_intersect_key($config + $this->defaultConfig, $this->defaultConfig);
  }

  /**
   * Generates data to be served with the Javascript application code bundle.
   *
   * @return array
   */
  public function getInitData() {

  }

  /**
   * Process a request
   *
   * @return array
   */
  public function processRequest($request) {

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

  }

}

