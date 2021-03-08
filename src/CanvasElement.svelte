<script>
  import { dragging } from "./stores/dragging";

  export let x = 0;
  export let y = 0;

  const dragStart = (e) => {
    dragging.set(true);
  };

  const dragEnd = (e) => {
    dragging.set(false);
  };
</script>

<div
  draggable="true"
  on:dragstart={dragStart}
  on:dragend={dragEnd}
  class="canvas-element"
  style="top: {y}px; left: {x}px;"
>
  <slot />
</div>

<style>
  .canvas-element {
    position: absolute;
  }
</style>
