<!-- the following line is required while using babel -->
<svelte:options accessors={true}/>
<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let doneBefore =0,
      percent = tweened(0),
      running = false;

  /**
   * startTimer starts it, and tweens it up to percentDoneAtEndOfNewJob, over
   * expectedSeconds time, from wherever it was, or from 0 if reset given.
   */
  export const startTimer = (expectedSeconds, percentDoneAtEndOfNewJob, opts) => {
    opts = Object.assign({ reset: false, easing: true }, opts || {});

    if (opts.reset) {
      percent = tweened(0);
    }

    percent.set(percentDoneAtEndOfNewJob, {
      duration: expectedSeconds*1000,
      easing: opts.easing ? cubicOut : null
    });

    if (!running) {
      running = true;
    }
  };

  export const cancelTimer = () => {
    percent = tweened(0);
    running = false;
  };

  export const completed = () => {
    percent.set(100, { duration: 300 });
    running = false;
  };

</script>

<progress value={$percent/100} class:running />


<style>
  progress {
    display: block;
    transition: opacity 0.3s;
    opacity: 0;
    width: 100%;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: none;

    height: 0.5rem;
    /* IE bar colour */
    color: #0162B7;
    /* Firefox background */
    background-color: #eee;
  }

  /* For some reason webkit browsers seem to ignore any rules targeting pseudo
   * elements if there's a specifier above it, e.g. progress::-pseudo works but
   * progress.someclass::-pseudo does not and neither does div.someclass
   * progress::-pseudo */
  /* this is the coloured bar representing the value */
  :global(progress::-webkit-progress-value) {
    background-color: #0162B7;
  }
  /* this is how to set the background for the bar's domain in webkit */
  :global(progress::-webkit-progress-bar) {
    background-color: #eee;
  }

  /* this is how to set the background for the bar's domain in firefox */
  progress::-moz-progress-bar {
    background-color: #0162B7;
    border:none;
  }

  .running {
    opacity: 1;
  }
</style>
