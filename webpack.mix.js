let mix = require('laravel-mix');

require('laravel-mix-svelte');

mix
  .js('src/inlaysignup.js', 'dist')
  //.sass('src/inlaysignup.scss', 'dist')
  .svelte(
    // { dev: true }
  )
;
