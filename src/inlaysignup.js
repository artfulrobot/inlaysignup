import App from './App.svelte';

// InlaySignup app
(() => {
  if (!window.inlaySignupInit) {
    // This is the first time this *type* of Inlay has been encountered.
    // We need to define anything global here.

    /**
     * Provide a boot function for this inlay type.
     *
     * The inlay object has the following properties:
     * - initData object of data served along with the bundle script.
     * - publicID string for the inlay instance on the server. Nb. you may have
     *            multiple instances of that instance(!) on a web page.
     * - script   DOM node of the script tag that has caused us to be loaded,
     *            e.g. useful for positioning our UI after it, or extracting
     *            locally specified data- attributes.
     * - request(fetchParams)
     *            method providing fetch() wrapper for all Inlay-related
     *            requests. The URL is fixed, so you only provide the params
     *            object.
     */
    window.inlaySignupInit = inlay => {

      // Here we create a node after the <script/> tag to hold the form.
      const signupAppDiv = document.createElement('div');
      signupAppDiv.classList.add('inlaysignup-container');
      inlay.script.insertAdjacentElement('afterend', signupAppDiv);

      // Now load our Svelte app into that.
      const app = new App({
        target: signupAppDiv,
        props: { inlay }
      });
    };
  }
})();
