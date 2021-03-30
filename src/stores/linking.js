import { writable } from "svelte/store";

/*
Contains the start and end elements being linked and the point to draw the line to 
{
   start: String,
   end: String,
   x: Number,  // mouse x pos
   y: Number,  // mouse y pos
}
*/
export const linking = writable({});
