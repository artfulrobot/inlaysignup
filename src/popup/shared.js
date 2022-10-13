import { writable } from 'svelte/store';
let idCounter = 0;

function nextID() {
  idCounter++;
  return 'id' + idCounter;
}

export { nextID };
