import { writable } from 'svelte/store';

const secretActive = writable(false);
const secretCounter = writable(0);

export { secretActive, secretCounter };