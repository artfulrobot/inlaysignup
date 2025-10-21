<?php
// This file declares an Angular module which can be autoloaded
// in CiviCRM. See also:
// \https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_angularModules/n
return [
  'js' => [
    'ang/inlaysignup.js',
    'ang/inlaysignup/*.js',
    'ang/inlaysignup/*/*.js',
  ],
  'css' => [
    'ang/inlaysignup.css',
  ],
  'partials' => [
    'ang/inlaysignup',
  ],
  'requires' => [
    'crmUi',
    'crmUtil',
    'ngRoute',
  ],
];
