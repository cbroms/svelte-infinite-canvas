import { writable } from "svelte/store";

/*
Contains the item being dragged
{
    id: String,
    x: Number,
    y: Number,
    dropped: bool,
}
*/
export const dragging = writable({});
