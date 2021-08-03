let mix = require('laravel-mix');
let sveltePreprocess = require('svelte-preprocess');

require('laravel-mix-svelte');

mix
  .setPublicPath('dist')
  .js('src/inlaysignup.js', 'dist')
  .svelte({
    // If dev === true, causes extra code to be added to components that will perform
    // runtime checks and provide debugging information during development.
    dev: process.env.NODE_ENV === 'development',
    // sveltePreprocess allows us to use <style lang=scss >, and also allows use of autoprefixer
    preprocess: sveltePreprocess({
      postcss: {
        plugins: [require('autoprefixer')()]
      },
      // This allows us to use modern JS in our svelte files
      // The JS gets transpiled to es6, before svelte compiles it
      // I don't know whether Mix then further babels the finished js?
      // I don't think I need to support
      babel: {
        presets: [
          [
            '@babel/preset-env',
            {
              loose: true,
              // No need for babel to resolve modules
              modules: false,
              // This seems to be the most browsers we can support without triggering
              // warnings and requiring <svelte:options accessors={true}/>
              targets: "> 0.35%, not dead, not IE<=11"
              // targets: {
              //   // ! Very important. Target es6+
              //   esmodules: true,
              // }
            },
          ],
        ],
      },
    }),
  })
;
