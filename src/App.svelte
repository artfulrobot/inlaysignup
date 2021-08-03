<script>
  const cookieExpiryDays = 90;

  import { onMount } from 'svelte';
  import Input from './Input.svelte';
  import Progress from './Progress.svelte';
  import {CookieService} from './CookieService.js';

  // List our props
  // Holds the inlay object which is like {request, script, publicID, initData}
  export let inlay;

  //  Texts
  let title, smallprintHTML, submitButtonText, thanksHTML, introHTML,
      // User input
      first_name, last_name, email,
      // Internals
      form, busy = false, progress, pageLoadedTime, windowScrollY, lastScrollY,
      hasScrolledDown = false, dismissedThisSession = false,
      state = 'hidden';

  $: {
    if (!dismissedThisSession) {
      if (!hasScrolledDown) {
        if (+windowScrollY > document.body.scrollHeight/2) {
          hasScrolledDown = true;
        }
        lastScrollY = windowScrollY;
      }
      else {
        if (windowScrollY < lastScrollY - 20) {
          state = 'popup';
        }
      }
    }
  }

  // Handler for document mouseout
  const mouseOut = e => {
    if ((new Date() - pageLoadedTime) < 10000) {
      // Don't do anything until they've been on the page 10s.
      return;
    }
    if (!e.toElement && !e.relatedTarget && e.clientY < 10) {
      // The mouse has exited the document, at the top.
      state = 'popup';
    }
  };

  onMount(() => {
    pageLoadedTime = new Date();
    title = inlay.initData.title || 'Sign up';
    introHTML = inlay.initData.introHTML || 'intro for your support.';
    submitButtonText = inlay.initData.submitButtonText || 'Sign up';
    smallprintHTML = inlay.initData.smallprintHTML || '';
    thanksHTML = inlay.initData.webThanksHTML || 'Thanks for your support.';

    if (!CookieService.getCookie('declinedSignup')) {
      document.addEventListener('mouseout', mouseOut);
    }
    else {
      console.log("We will not offer you a signup pop-up because you have previously declined. Unset your declinedSignup cookie to reset this.");
    }
  });

  function dismissed(e) {
    dismissedThisSession = true;
    state = 'hidden';
    console.log("Signup pop-up dismissed. We have set a cookie 'declinedSignup' which means we won't bother you with it again for " + cookieExpiryDays + " days.");
    document.removeEventListener('mouseout', mouseOut);
    // Now we have shown the popup, don't show it again for cookieExpiryDays days.
    CookieService.setCookie('declinedSignup', true, cookieExpiryDays);
  }

  /**
   * Called to ...
   */
  function cancelSubmission() {
    busy = false;
    progress.cancelTimer();
  }

  async function handleSubmit(event) {

    const formData = { first_name, last_name, email, source: window.location.href };

    busy = true;
    let r = await inlay.request({ method: 'post', body: formData});

    if (r.error) {
      alert("Sorry, there was a problem with the form: " + r.error);
      cancelSubmission();
      return;
    }
    else if (!r.token) {
      alert("Sorry, an unexpected error occured. Please try again");
      cancelSubmission();
      return;
    }
    else if (r.token) {
      //console.log("Token received, waiting 5s");
      // Expect it to take 6s to get to 80% though we'll be done in 5.
      progress.startTimer(6, 80);
      setTimeout(async () => {
        // console.log("Sending 2nd request, with token");
        // Expect it to take 2s to get to 100%
        progress.startTimer(2, 100);
        r = await inlay.request({ method: 'post', body: Object.assign({token: r.token}, formData )});
        if (r.success) {
          progress.completed();
          state = 'thanks';
          busy = false;

          // Now we have shown the popup, don't show it again for cookieExpiryDays days.
          console.log("We have set a cookie 'declinedSignup' which means we won't bother you with the pop-up again. The cookie expires in " + cookieExpiryDays + " days.");
          CookieService.setCookie('declinedSignup', true, cookieExpiryDays);
        }
        else {
          alert("Sorry, there was a problem with the form: " + (r.error || 'unknown error'));
          cancelSubmission();
          return;
        }
      }, 5000);
    }
  }


</script>

<svelte:window bind:scrollY={windowScrollY}/>
<article class="inlay-signup-overlay {state === 'hidden' ? state : 'popup'}">
  <h1>{title}</h1>
  <button on:click|preventDefault={dismissed} class="dismiss" title="Close" >✕</button>
  {#if state === 'popup'}
  <form on:submit|preventDefault="{handleSubmit}">
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
      />
      <Input
        label="Last Name"
        initialCaps=1
        active={!busy}
        bind:validValue={last_name}
        required
        class="last-name"
        name="last_name"
      />

      <div class="wide-col">
        <Input
          label="Email"
          type=email
          bind:validValue={email}
          active={!busy}
          required
          class="email"
          name="email"
        />
      </div>

      <div class="wide-col submit">
        <button disabled={ busy } type=submit class="submit" >{busy ? 'Please wait...' : submitButtonText}</button>
        <Progress bind:this={progress} />
      </div>

      <div class="wide-col smallprint">{@html smallprintHTML}</div>

      <!--<pre> {JSON.stringify({first_name, last_name, email, x: [first_name!==null, last_name!==null, email!==null,  first_name!== null && last_name !== null  && email !==null ]})} </pre>-->
    </div>
  </form>
  {:else if state == 'thanks'}
    <div class="thanks">
      {@html thanksHTML}
    </div>
  {/if}
</article>

<style>
  article.inlay-signup-overlay {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 23rem;
    height: auto;
    background: white;
    transform: translateY(10%);
    opacity: 0;
    transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.2s linear;
    box-shadow: -10px -10px 30px 0 rgba(0,0,0,0.2);
    padding: 1rem;
  }
  article.inlay-signup-overlay.popup {
    transform: none;
    opacity: 1;
  }

  h1 {
    /* Leave space for close button, and a bit below. */
    margin: 0 3rem 1rem 0;
    font-size: 1.4rem;
    margin-right: 3rem;
    font-family: 'Libre Baskerville';
    font-weight: 700;
    text-align: center;
  }

  form>div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  form .wide-col  {
    grid-column: 1/3;
  }

  article.inlay-signup-overlay :global(input) {
    /* Override site's style which has it looking faded */
    color: #222;
  }

  article.inlay-signup-overlay :global(.intro),
  article.inlay-signup-overlay :global(.intro p)
  {
    font-family: 'Libre Baskerville';
    font-size: 1rem; /* 16px */
    margin-bottom: 0;
  }
  .intro :global(p) {
    margin-bottom: 0;
  }
  article.inlay-signup-overlay :global(.intro p + p) {
    margin-bottom: 1rem;
  }

  article.inlay-signup-overlay :global(.smallprint),
  article.inlay-signup-overlay :global(.smallprint p) {
    opacity: 0.8;
    font-size: 0.8rem;
    margin-bottom: 0;
  }
  article.inlay-signup-overlay :global(.smallprint p + p) {
    margin-bottom: 1rem;
  }

  /* Bump progress into the grid gap */
  article.inlay-signup-overlay :global(progress) {
    transform: translateY(0.5rem);
  }

  button.submit {
    width: 100%;
    /* this copied from the screenshot */
    background: #333E45;
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


</style>

