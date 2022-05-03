let mix = require('laravel-mix');

//require('laravel-mix-bundle-analyzer');
if (false && !mix.inProduction()) {
    mix.bundleAnalyzer();
}


mix
  .js('src/signup.js', 'dist/inlay-signup.js')
  .js('src/contact.js', 'dist/inlay-contact.js')
  .js('src/signupA.js', 'dist/inlay-signup-a.js')
  .vue({version: 2})
;
