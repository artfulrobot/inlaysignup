<script>
  import { onMount, tick } from "svelte";
  import Input from "./Input.svelte";
  import Progress from "./Progress.svelte";
  import { CookieService } from "./CookieService.js";

  // List our props
  // Holds the inlay object which is like {request, script, publicID, initData}
  export let inlay;

  //  Texts
  let title,
    smallprintHTML,
    submitButtonText,
    thanksHTML,
    introHTML,
    // User input
    first_name,
    last_name,
    email,
    // Internals
    form,
    busy = false,
    progress,
    pageLoadedTime,
    windowScrollY,
    lastScrollY,
    hasScrolledDown = false,
    dismissedPopup = false,
    state = "hidden", // hidden|popup|thanks
    wrapperTag = inlay.initData.modal || false ? "dialog" : "div", // div|dialog
    wrapperElement, // holds the DOM node
    firstInputField,
    debug = CiviCRMInlay.debug || (() => {});
  $: {
    if (!dismissedPopup) {
      if (!hasScrolledDown) {
        const vh = Math.max(
          document.documentElement.clientHeight || 0,
          window.innerHeight || 0
        );

        if (
          Math.floor(
            (windowScrollY / (document.body.scrollHeight - vh)) * 100
          ) >= inlay.initData.minScrollPercent
        ) {
          hasScrolledDown = true;
          debug(
            "inlaysignup: scrolled at least",
            inlay.initData.minScrollPercent,
            "%"
          );
        }
        lastScrollY = windowScrollY;
      } else {
        if (windowScrollY < lastScrollY - 20 && state !== "thanks") {
          debug("inlaysignup: triggering as scrolling up");
          changeState("popup");
        }
      }
    }
  }

  const changeState = async (newState) => {
    const stateIsOpen = state !== "hidden";
    const newStateIsOpen = (newState || "hidden") !== "hidden";
    if (wrapperTag === "dialog" && wrapperElement) {
      if (newStateIsOpen && !stateIsOpen) {
        wrapperElement.showModal();
      } else if (!newStateIsOpen && stateIsOpen) {
        wrapperElement.close();
      }
    }
    state = newState;
    if (state === "popup") {
      await tick();
      setTimeout(firstInputField.focus, 400);
    }
  };
  debug("inlaysignup changeState - trigger with popup/thanks/hidden", {
    changeState,
  });

  // Handler for document mouseout
  const mouseOut = (e) => {
    if (new Date() - pageLoadedTime < inlay.initData.notBefore * 1000) {
      // Don't do anything until they've been on the page 10s.
      debug("Ignoring mouse out as timeout not exceeded.");
      return;
    }
    if (
      !e.toElement &&
      !e.relatedTarget &&
      e.clientY < 10 &&
      state !== "thanks"
    ) {
      // The mouse has exited the document, at the top.
      debug("Triggering on mouse out as timeout not exceeded.");
      changeState("popup");
    }
  };

  onMount(() => {
    pageLoadedTime = new Date();
    title = inlay.initData.title || "Sign up";
    introHTML = inlay.initData.introHTML || "intro for your support.";
    submitButtonText = inlay.initData.submitButtonText || "Sign up";
    smallprintHTML = inlay.initData.smallprintHTML || "";
    thanksHTML = inlay.initData.webThanksHTML || "Thanks for your support.";

    if (!CookieService.getCookie("declinedSignup")) {
      document.addEventListener("mouseout", mouseOut);
    } else {
      console.info(
        "We will not offer you a signup pop-up because you have previously declined. Unset your declinedSignup cookie to reset this."
      );
      dismissedPopup = true;
    }

    if (
      inlay.initData.customCSS.replace(/\s+/, "") &&
      !document.getElementById("custom-style-" + inlay.publicID)
    ) {
      let customStyle = document.createElement("style");
      customStyle.id = "custom-style-" + inlay.publicID;
      customStyle.textContent = inlay.initData.customCSS;
      document.head.insertAdjacentElement("beforeend", customStyle);
    }
  });

  function dismissed(e) {
    dismissedPopup = true;
    changeState("hidden");
    console.info(
      "Signup pop-up dismissed. We have set a cookie 'declinedSignup' which means we won't bother you with it again for " +
        inlay.initData.cookieExpiryDays +
        " days."
    );
    document.removeEventListener("mouseout", mouseOut);
    // Now we have shown the popup, don't show it again for cookieExpiryDays days.
    CookieService.setCookie(
      "declinedSignup",
      true,
      inlay.initData.cookieExpiryDays
    );
  }

  /**
   * Called to ...
   */
  function cancelSubmission() {
    busy = false;
    progress.cancelTimer();
  }

  async function handleSubmit(event) {
    const formData = {
      first_name,
      last_name,
      email,
      source: window.location.href,
    };

    busy = true;
    progress.startTimer(2, 10);
    let r = await inlay.request({ method: "post", body: formData });

    if (r.error) {
      alert("Sorry, there was a problem with the form: " + r.error);
      cancelSubmission();
      return;
    } else if (!r.token) {
      alert("Sorry, an unexpected error occured. Please try again");
      cancelSubmission();
      return;
    } else if (r.token) {
      debug("Token received, waiting 5s");
      // Expect it to take 6s to get to 80% though we'll be done in 5.
      progress.startTimer(6, 80);
      setTimeout(async () => {
        debug("Sending 2nd request, with token");
        // Expect it to take 2s to get to 100%
        progress.startTimer(2, 100);
        r = await inlay.request({
          method: "post",
          body: Object.assign({ token: r.token }, formData),
        });
        if (r.success) {
          progress.completed();
          changeState("thanks");
          busy = false;

          // Now we have shown the popup, don't show it again for cookieExpiryDays days.
          console.info(
            "We have set a cookie 'declinedSignup' which means we won't bother you with the pop-up again. The cookie expires in " +
              inlay.initData.cookieExpiryDays +
              " days."
          );
          CookieService.setCookie(
            "declinedSignup",
            true,
            inlay.initData.cookieExpiryDays
          );

          // Allow others to take action, e.g. for analytics.
          let e = new Event("InlaySignupComplete");
          e.inlay = inlay;
          document.dispatchEvent(e);
        } else {
          alert(
            "Sorry, there was a problem with the form: " +
              (r.error || "unknown error")
          );
          cancelSubmission();
          return;
        }
      }, 5000);
    }
  }
</script>

<svelte:window bind:scrollY={windowScrollY} />

<svelte:element
  this={wrapperTag}
  on:close={dismissed}
  bind:this={wrapperElement}
  class="inlay-signup-overlay {state === 'hidden' ? state : 'popup'}"
>
  <article>
    <h1>{title}</h1>
    <button on:click|preventDefault={dismissed} class="dismiss" title="Close"
      >✕</button
    >
    {#if state === "popup"}
      <form on:submit|preventDefault={handleSubmit}>
        <div>
          {#if introHTML}
            <div class="wide-col intro">
              {@html introHTML}
            </div>
          {/if}
          <Input
            label="First Name"
            required
            initialCaps
            active={!busy}
            bind:validValue={first_name}
            class="first-name"
            name="first_name"
            bind:this={firstInputField}
          />
          <Input
            label="Last Name"
            initialCaps="1"
            active={!busy}
            bind:validValue={last_name}
            required
            class="last-name"
            name="last_name"
          />

          <div class="wide-col">
            <Input
              label="Email"
              type="email"
              bind:validValue={email}
              active={!busy}
              required
              class="email"
              name="email"
            />
          </div>

          <div class="wide-col name-submit">
            <button disabled={busy} type="submit" class="submit"
              >{busy ? "Please wait..." : submitButtonText}</button
            >
            <Progress bind:this={progress} />
          </div>

          <div class="wide-col smallprint">{@html smallprintHTML}</div>

          <!--<pre> {JSON.stringify({first_name, last_name, email, x: [first_name!==null, last_name!==null, email!==null,  first_name!== null && last_name !== null  && email !==null ]})} </pre>-->
        </div>
      </form>
    {:else if state == "thanks"}
      <div class="thanks">
        {@html thanksHTML}
      </div>
    {/if}
  </article>
</svelte:element>

<style lang="scss" global>
  // The default state is hidden:

  dialog.inlay-signup-overlay {
    &::backdrop {
      background: rgba(0, 0, 0, 0.25);
    }
  }

  div.inlay-signup-overlay {
    position: fixed;
    z-index: 1;
    bottom: 0;
    right: 0;
    height: auto;
    box-shadow: -10px -10px 30px 0 rgba(0, 0, 0, 0.2);
    &.hidden {
      pointer-events: none;
    }
  }

  // This is both dialog and original type
  .inlay-signup-overlay {
    border: none;
    opacity: 0;
    width: 23rem;
    max-height: 100vh;
    overflow-y: auto;
    background: white;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s linear;
    padding: 1rem;
  }
  .inlay-signup-overlay.popup {
    transform: none;
    opacity: 1;
  }
  .inlay-signup-overlay > article {
  }
  .inlay-signup-overlay.popup > article {
  }

  .inlay-signup-overlay {
    h1 {
      /* Leave space for close button, and a bit below. */
      margin: 0 3rem 1rem 0;
      font-size: 1.4rem;
      margin-right: 3rem;
    }

    form > div {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    form .wide-col {
      grid-column: 1/3;
    }

    .inlay-signup-overlay :global(input) {
      /* Override site's style which has it looking faded */
      color: #222;
    }

    .inlay-signup-overlay :global(.intro),
    .inlay-signup-overlay :global(.intro p) {
      font-size: 1rem; /* 16px */
      margin-bottom: 0;
    }
    .intro :global(p) {
      margin-bottom: 0;
    }
    .inlay-signup-overlay :global(.intro p + p) {
      margin-bottom: 1rem;
    }

    .inlay-signup-overlay :global(.smallprint),
    .inlay-signup-overlay :global(.smallprint p) {
      opacity: 0.8;
      font-size: 0.8rem;
      margin-bottom: 0;
    }
    .inlay-signup-overlay :global(.smallprint p + p) {
      margin-bottom: 1rem;
    }

    /* Bump progress into the grid gap */
    .inlay-signup-overlay :global(progress) {
      transform: translateY(0.5rem);
    }

    button.submit {
      width: 100%;
    }

    button.dismiss {
      background: none;
      border-radius: 2rem;
      width: 2rem;
      height: 2rem;
      position: absolute;
      right: 1rem;
      top: 1rem;
      text-align: center;
      font-size: 1rem;
      padding: 0;
      line-height: 1;
      margin: 0;
      color: #aaa;
      border: solid 1px #aaa;
      z-index: 1;
      background: white;
      appearance: none;
    }
    button.dismiss:hover {
      background: #aaa;
      color: #777;
    }
    .input-wrapper,
    .input-wrapper * {
      box-sizing: border-box;
    }
    .input-wrapper {
      position: relative;
      width: 100%;
      display: inline-block;
      vertical-align: top;
    }
    .input-wrapper label {
      padding-right: 2rem;
      display: block;
    }
    .input-wrapper.invalid label {
      color: #a00;
    }
    .input-wrapper label .ok {
      position: absolute;
      right: 0;
      color: #080;
      width: 2rem;
      text-align: center;
    }
    .error {
      color: #a00;
    }

    input {
      display: block;
      width: 100%;
    }

    input:valid {
      border-color: #0a0;
    }
  }
</style>
