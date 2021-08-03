<script>
  import { onMount, tick } from 'svelte';

  let x = '';
  $: y = !!x;

  onMount(async () => {
    console.log('Initial', {x, y});
    // Initial Object { x: "", y: false }
    x='foo';
    await tick();
    console.log('After setting x', {x, y});
  });

</script>

<pre>{JSON.stringify({x, y})}</pre>

