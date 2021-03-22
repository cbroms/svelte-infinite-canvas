<script>
  import { onMount, onDestroy } from "svelte";
  import { zoom } from "./stores/zoom";
  import { linkedElements } from "./stores/linkedElements";
  import { position } from "./stores/position";
  import panzoom from "panzoom";
  import { dragging } from "./stores/dragging";
  import { linking } from "./stores/linking";

  export let showControls = false;
  export let panzoomOptions = {
    maxZoom: 5,
    minZoom: 0.2,
    initialZoom: 1,
    // beforeMouseDown: (e) => {
    //   return !e.altKey;
    // },
  };

  export let x = 1000;
  export let y = 1000;

  let canvasElt = null;
  let panzoomInstance = null;

  onMount(() => {
    panzoomInstance = panzoom(canvasElt, panzoomOptions);
    // panzoomInstance.moveTo(centerX, centerY);

    // linkedElements.update((elts) => {
    //   return { ...elts, canvas: canvasElt };
    // });

    panzoomInstance.on("transform", (e) => {
      // keep track of the element's scale so we can adjust dragging to match
      const level =
        parseFloat(
          canvasElt.style.transform.split(",")[0].replace("matrix(", "")
        ) || 1;
      zoom.set(level);
      position.set(canvasElt.style.transform);
    });
  });

  $: {
    if ($dragging.id || $linking.start) {
      panzoomInstance.pause();
    } else if (panzoomInstance) {
      panzoomInstance.resume();
    }
  }

  onDestroy(() => {
    panzoomInstance.dispose();
  });
</script>

<div class="canvas-container">
  <div style="height: {y}px; width: {x}px;" bind:this={canvasElt}>
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
