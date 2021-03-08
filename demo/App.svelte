<script>
  import InfiniteCanvas from "../src/InfiniteCanvas.svelte";
  import CanvasElement from "../src/CanvasElement.svelte";
</script>

<div class="layout">
  <div class="sidebar" />
  <div class="header" />
  <div class="area">
    <InfiniteCanvas>
      <CanvasElement>Hi there this is some stuff</CanvasElement>
    </InfiniteCanvas>
  </div>
</div>

<style>
  .layout {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 50px 1fr;
  }

  .sidebar {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    background-color: indianred;
  }

  .header {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    background-color: black;
  }

  .area {
    overflow: hidden;
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }
</style>
