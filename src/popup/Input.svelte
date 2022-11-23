<script>
import { onMount } from 'svelte';
import { nextID } from './shared.js';

export let label = '';
export let active = true;
export let initialValue = '';
export let validValue = '';
export let required = null;
export let type = 'text';
export let name = '';
export let initialCaps = false;

export function focus() {
  input && input.focus();
}
let pristine = true;
let input;
let validationMessage;
let myID = nextID();

$: invalid = !pristine && !!validationMessage;

onMount(() => {
  input.value = initialValue;
  handleInput();
});

function updateValidation() {
  validationMessage = input.validationMessage;
}
function handleInput(e) {
  if (e) pristine = false;
  updateValidation();
  // We can't use invalid as it won't have been recomputed yet. (we could await tick())
  if (!!validationMessage) {
    validValue = null;
  }
  else {
    if (input.value && initialCaps && input.value[0].match(/[a-z]/)) {
      input.value = input.value[0].toLocaleUpperCase() + input.value.substr(1);
    }
    validValue = type.match(/^(number|range)$/)
      ? +input.value
      : input.value;
  }
}
</script>

<div class="input-wrapper name-{name}" class:invalid>
  <label for={myID}>{label}
    {#if !pristine && validValue}<span class="ok" title="Valid" >✔</span>{/if}
  </label>
  <input
      id={myID}
      type={type}
      {required}
      {name}
      disabled={!active}

      on:change="{handleInput}"
      on:blur="{updateValidation}"
      bind:this={input}
      />
  {#if !pristine && validationMessage}
    <p class="error">{validationMessage}</p>
  {/if}
</div>
