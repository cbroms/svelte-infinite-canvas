<script>
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import { zoom } from "./stores/zoom";
  import { position } from "./stores/position";
  import panzoom from "panzoom";

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

<div bind:this={canvasElt}>
  <slot />
</div>

<style>
  div {
    height: 100%;
  }
</style>
