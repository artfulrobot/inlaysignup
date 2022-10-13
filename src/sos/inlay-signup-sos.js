import Vue from 'vue';
import InlaySignupA from './InlaySignupA.vue';

(() => {

  if (!window.inlaySignupAInit) {
    // This is the first time this *type* of Inlay has been encountered.
    // We need to define anything global here.

    // Create the boot function.
    window.inlaySignupAInit = inlay => {
      const inlayNode = document.createElement('div');
      inlay.script.insertAdjacentElement('afterend', inlayNode);
      /* eslint no-unused-vars: 0 */

      // Ugly custom hacks.
      const sosCustom = {
              '5612e1ca4e8a': 'whole_earth',
              '6c471fba10bf': 'bath_bomb_soundscape',
            }[inlay.publicID] || '';

      // This is the root app.
      console.debug(inlay);
      const app = new Vue({
        el: inlayNode,
        data() {
          var d = {
            inlay,
            formID: 0,
            submissionRunning: false,
            sosCustom,
          };
          return d;
        },
        render: h => h(InlaySignupA, {props: {inlay, sosCustom}}),
        methods: {
          getNextId() {
            this.formID++;
            return `i${this.inlay.publicID}-${this.formID}`;
          }
        }
      });
    };
  }
})();
