<?php

require_once 'inlaysignup.civix.php';
// phpcs:disable
use CRM_Inlaysignup_ExtensionUtil as E;
// phpcs:enable

/**
 * Implements hook_civicrm_container().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_container/
 */
function inlaysignup_civicrm_container($container) {
  // https://docs.civicrm.org/dev/en/latest/hooks/usage/symfony/
  $container->findDefinition('dispatcher')
    ->addMethodCall('addListener', ['hook_inlay_registerType', [Civi\Inlay\InlaySignup::class, 'register']])
  ;
}

/**
 * Implements hook_civicrm_config().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_config/
 */
function inlaysignup_civicrm_config(&$config) {
  _inlaysignup_civix_civicrm_config($config);
}

/**
 * Implements hook_civicrm_install().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_install
 */
function inlaysignup_civicrm_install() {
  _inlaysignup_civix_civicrm_install();
}

/**
 * Implements hook_civicrm_enable().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_enable
 */
function inlaysignup_civicrm_enable() {
  _inlaysignup_civix_civicrm_enable();
}

// --- Functions below this ship commented out. Uncomment as required. ---

/**
 * Implements hook_civicrm_preProcess().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_preProcess
 */
//function inlaysignup_civicrm_preProcess($formName, &$form) {
//
//}

/**
 * Implements hook_civicrm_navigationMenu().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_navigationMenu
 */
//function inlaysignup_civicrm_navigationMenu(&$menu) {
//  _inlaysignup_civix_insert_navigation_menu($menu, 'Mailings', array(
//    'label' => E::ts('New subliminal message'),
//    'name' => 'mailing_subliminal_message',
//    'url' => 'civicrm/mailing/subliminal',
//    'permission' => 'access CiviMail',
//    'operator' => 'OR',
//    'separator' => 0,
//  ));
//  _inlaysignup_civix_navigationMenu($menu);
//}
