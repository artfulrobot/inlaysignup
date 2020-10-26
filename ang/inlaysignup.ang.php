<?php
// This file declares an Angular module which can be autoloaded
// in CiviCRM. See also:
// \https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_angularModules/n
return [
  'js' => [
    'ang/inlaysignup.js',
    'ang/inlaysignup/*.js',
    'ang/inlaysignup/*/*.js',
    'ang/inlaycontact.js',
    'ang/inlaycontact/*.js',
    'ang/inlaycontact/*/*.js',
  ],
  'css' => [
    'ang/inlaysignup.css',
    'ang/inlaycontact.css',
  ],
  'partials' => [
    'ang/inlaysignup',
    'ang/inlaycontact',
  ],
  'requires' => [
    'crmUi',
    'crmUtil',
    'ngRoute',
  ],
  'settings' => [],
];
