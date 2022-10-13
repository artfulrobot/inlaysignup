<script>
  console.log("Test.svelte loaded");
</script>

<div>
  <p><strong>x</strong><input type=text />
</p>
<progress>
</div>
<style lang="scss" global>
  input {
    appearance: none;
    color: #123456;
  }
  div {
      p {
      display: grid;
      transition: all .5s;
      user-select: none;
      background: linear-gradient(to bottom, white, black);
    }
    progress::--progress-value { background-color: red; }
  }
  progress::-webkit-progress-value {
    background-color: #0162B7;
  }
  /* this is how to set the background for the bar's domain in webkit */
  progress::-webkit-progress-bar {
    background-color: #eee;
  }

  /* this is how to set the background for the bar's domain in firefox */
  progress::-moz-progress-bar {
    background-color: #0162B7;
    border:none;
  }
</style>

