import { writable } from "svelte/store";

/*
Contains a map of element references and x/y positions:
{
    [id: String]: {
        element: DOMNode,
        x: Number,
        y: Number,
    }
}
*/
export const linkedElements = writable({});
