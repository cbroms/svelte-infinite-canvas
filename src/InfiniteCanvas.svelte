<script>
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import { dragging } from "./stores/dragging";
  import panzoom from "panzoom";

  const createGrid = (scale) => {
    const columns = (scale / 5) * 20;
    const rows = (scale / 5) * 20;

    const grid = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        if (i === rows / 2 && j === columns / 2) row.push(true);
        else row.push(null);
      }
      grid.push(row);
    }
    return [
      grid,
      -1 * (window.innerWidth / 2),
      -1 * (window.innerHeight / 2 / (window.innerWidth * 0.05)),
    ];
  };

  //   600
  //   1250
  export let panzoomOptions = {
    maxZoom: 10,
    minZoom: 0.5,
    initialZoom: 1,
    beforeMouseDown: function (e) {
      // allow mouse-down panning only if altKey is down. Otherwise - ignore
      var shouldIgnore = !e.altKey;
      return shouldIgnore;
    },
  };

  let canvasElt = null;
  let panzoomInstance = null;
  let [rows, centerX, centerY] = createGrid(panzoomOptions.maxZoom);

  onMount(() => {
    panzoomInstance = panzoom(canvasElt, panzoomOptions);
    panzoomInstance.moveTo(centerX, centerY);
  });

  onDestroy(() => {
    panzoomInstance.dispose();
  });

  afterUpdate(() => {
    if ($dragging) panzoomInstance.pause();
    else panzoomInstance.resume();
  });
</script>

<div bind:this={canvasElt}>
  <slot />
  <div class="grid">
    {#each rows as column}
      <div>
        {#each column as placement}
          <div class="grid-square" class:center={placement} />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .grid {
    width: 200vw;
    min-width: 2000px;
  }

  .center {
    background-color: indianred;
  }

  .grid-square {
    box-sizing: border-box;
    display: inline-block;
    height: 5vw;
    width: 5vw;
    min-height: 50px;
    min-width: 50px;
    border: 1px solid black;
  }
</style>
