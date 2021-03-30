import { writable } from "svelte/store";

/*
Contains the ids of any animating objects
[
    id: String
]
*/
export const animating = writable([]);
