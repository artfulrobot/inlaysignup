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
  //Civi::dispatcher()
  $container->findDefinition('dispatcher')
    ->addMethodCall('addListener', ['hook_inlay_registerType', [Civi\Inlay\CoDownload::class, 'register']])
    //->addMethodCall('addListener', ['hook_inlay_registerType', [Civi\Inlay\InlaySignup::class, 'register']])
    //->addMethodCall('addListener', ['hook_inlay_registerType', [Civi\Inlay\Contact::class, 'register']])
    //->addMethodCall('addListener', ['hook_inlay_registerType', [Civi\Inlay\SignupA::class, 'register']])
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
 * Implements hook_civicrm_xmlMenu().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_xmlMenu
 */
function inlaysignup_civicrm_xmlMenu(&$files) {
  _inlaysignup_civix_civicrm_xmlMenu($files);
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
 * Implements hook_civicrm_postInstall().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_postInstall
 */
function inlaysignup_civicrm_postInstall() {
  _inlaysignup_civix_civicrm_postInstall();
}

/**
 * Implements hook_civicrm_uninstall().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_uninstall
 */
function inlaysignup_civicrm_uninstall() {
  _inlaysignup_civix_civicrm_uninstall();
}

/**
 * Implements hook_civicrm_enable().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_enable
 */
function inlaysignup_civicrm_enable() {
  _inlaysignup_civix_civicrm_enable();
}

/**
 * Implements hook_civicrm_disable().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_disable
 */
function inlaysignup_civicrm_disable() {
  _inlaysignup_civix_civicrm_disable();
}

/**
 * Implements hook_civicrm_upgrade().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_upgrade
 */
function inlaysignup_civicrm_upgrade($op, CRM_Queue_Queue $queue = NULL) {
  return _inlaysignup_civix_civicrm_upgrade($op, $queue);
}

/**
 * Implements hook_civicrm_managed().
 *
 * Generate a list of entities to create/deactivate/delete when this module
 * is installed, disabled, uninstalled.
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_managed
 */
function inlaysignup_civicrm_managed(&$entities) {
  _inlaysignup_civix_civicrm_managed($entities);
}

/**
 * Implements hook_civicrm_caseTypes().
 *
 * Generate a list of case-types.
 *
 * Note: This hook only runs in CiviCRM 4.4+.
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_caseTypes
 */
function inlaysignup_civicrm_caseTypes(&$caseTypes) {
  _inlaysignup_civix_civicrm_caseTypes($caseTypes);
}

/**
 * Implements hook_civicrm_angularModules().
 *
 * Generate a list of Angular modules.
 *
 * Note: This hook only runs in CiviCRM 4.5+. It may
 * use features only available in v4.6+.
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_angularModules
 */
function inlaysignup_civicrm_angularModules(&$angularModules) {
  _inlaysignup_civix_civicrm_angularModules($angularModules);
}

/**
 * Implements hook_civicrm_alterSettingsFolders().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_alterSettingsFolders
 */
function inlaysignup_civicrm_alterSettingsFolders(&$metaDataFolders = NULL) {
  _inlaysignup_civix_civicrm_alterSettingsFolders($metaDataFolders);
}

/**
 * Implements hook_civicrm_entityTypes().
 *
 * Declare entity types provided by this module.
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_entityTypes
 */
function inlaysignup_civicrm_entityTypes(&$entityTypes) {
  _inlaysignup_civix_civicrm_entityTypes($entityTypes);
}

/**
 * Implements hook_civicrm_thems().
 */
function inlaysignup_civicrm_themes(&$themes) {
  _inlaysignup_civix_civicrm_themes($themes);
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
