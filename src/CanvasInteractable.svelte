<script>
  import { onMount, onDestroy } from "svelte";
  import { zoom } from "./stores/zoom";
  import { position } from "./stores/position";
  import panzoom from "panzoom";

  export let showControls = false;
  export let panzoomOptions = {
    maxZoom: 5,
    minZoom: 0.2,
    initialZoom: 1,
    beforeMouseDown: (e) => {
      return !e.altKey;
    },
  };

  let canvasElt = null;
  let panzoomInstance = null;

  onMount(() => {
    panzoomInstance = panzoom(canvasElt, panzoomOptions);
    // panzoomInstance.moveTo(centerX, centerY);

    panzoomInstance.on("transform", (e) => {
      // keep track of the element's scale so we can adjust dragging to match
      const level = parseFloat(
        canvasElt.style.transform.split(",")[0].replace("matrix(", "")
      );
      zoom.set(level);
      position.set(canvasElt.style.transform);
    });
  });

  onDestroy(() => {
    panzoomInstance.dispose();
  });
</script>

<div class="canvas-container">
  <div bind:this={canvasElt}>
    <slot />
  </div>
  {#if showControls}
    <div class="canvas-controls">
      <button>+ Zoom in</button>
      <button>- Zoom out</button>
    </div>
  {/if}
</div>

<style>
  div {
    height: 100%;
  }

  .canvas-controls {
    position: absolute;
    bottom: 0;
    right: 0;
    height: auto;
  }

  .canvas-container {
    position: relative;
  }

  button {
    margin: 10px;
  }
</style>
