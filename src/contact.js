import Vue from 'vue';
import InlayContactForm from './InlayContactForm.vue';

(() => {
  if (!window.inlayContactInit) {
    // This is the first time this *type* of Inlay has been encountered.
    // We need to define anything global here.

    // Create the boot function.
    window.inlayContactInit = inlay => {
      const inlayContactNode = document.createElement('div');
      inlay.script.insertAdjacentElement('afterend', inlayContactNode);
      /* eslint no-unused-vars: 0 */
      // This is the root app.
      console.debug(inlay);
      const app = new Vue({
        el: inlayContactNode,
        data() {
          var d = {
            inlay,
            formID: 0,
            submissionRunning: false
          };
          return d;
        },
        render: h => h(InlayContactForm, {props: {inlay}}),
        methods: {
          getNextId() {
            this.formID++;
            return `i${this.inlay.public_id}-${this.formID}`;
          }
        }
      });
    };
  }
})();
