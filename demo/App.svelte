<script>
  //   import InfiniteCanvas from "../src/CanvasInteractable.svelte";
  //   import CanvasElement from "../src/CanvasElement.svelte";
  //   import CanvasElementLink from "../src/CanvasElementLink.svelte";
  import Canvas from "../src/Canvas.svelte";
  import Unit from "./Unit.svelte";

  let data = [
    { id: "one", x: 12, y: 235, text: "this is something", links: ["two"] },
    { id: "two", x: 400, y: 400, text: "this is something else", links: [] },
    { id: "three", x: 400, y: 600, text: "anotha one", links: [] },
    { id: "four", x: 200, y: 550, text: "and anotha", links: [] },
  ];

  const handleLinkStart = (e) => {
    console.log("link start");
  };

  const handleLinkEnd = (e) => {
    console.log("link end");
    data = data.map((elt) => {
      if (elt.id === e.detail.from) {
        elt.links.push(e.detail.to);
      }
      return elt;
    });
  };

  const handleDragStart = (e) => {
    console.log("drag start");
  };
  const handleDragEnd = (e) => {
    console.log("drag end");
    data = data.map((elt) => {
      if (elt.id === e.detail.id) {
        elt.x = e.detail.x;
        elt.y = e.detail.y;
      }
      return elt;
    });
  };
</script>

<div class="layout">
  <div class="sidebar" />
  <div class="header" />
  <div class="area">
    <Canvas
      {data}
      {Unit}
      on:linkstart={handleLinkStart}
      on:linkend={handleLinkEnd}
      on:dragstart={handleDragStart}
      on:dragend={handleDragEnd}
    />
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

  .dragger {
    background-color: pink;
    padding: 10px;
    border: 2px solid black;
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
