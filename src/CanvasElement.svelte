<script>
  import { linkedElements } from "./stores/linkedElements";
  import { dragging } from "./stores/dragging";
  import { zoom } from "./stores/zoom";

  import { onMount } from "svelte";

  export let x = 0;
  export let y = 0;
  export let id;

  let oldX, oldY, thisX, thisY;

  let element = null;

  onMount(() => {
    linkedElements.update((elts) => {
      return { ...elts, [id]: element };
    });
  });

  const dragEnd = (e) => {
    document.onmouseup = null;
    document.onmousemove = null;
    x = $dragging.x;
    y = $dragging.y;
    dragging.set({});
  };

  const dragDuring = (e) => {
    e.preventDefault();
    thisX = oldX - e.clientX;
    thisY = oldY - e.clientY;
    oldX = e.clientX;
    oldY = e.clientY;
    console.log($zoom);
    dragging.set({
      y: element.offsetTop - thisY * (1 / $zoom),
      x: element.offsetLeft - thisX * (1 / $zoom),
      id,
    });
  };

  const dragStart = (e) => {
    e.preventDefault();
    oldX = e.clientX;
    oldY = e.client;
    document.onmouseup = dragEnd;
    document.onmousemove = dragDuring;

    dragging.set({ x, y, id });
  };
</script>

<div
  bind:this={element}
  on:mousedown={dragStart}
  class:grabbed={$dragging.id === id}
  class="canvas-element"
  style="top: {($dragging.id === id && $dragging.y) ||
    y}px; left: {($dragging.id === id && $dragging.x) || x}px;"
>
  <slot />
</div>

<style>
  .canvas-element {
    position: absolute;
    cursor: grab;
  }

  .grabbed {
    cursor: grabbing;
  }
</style>
