<script>
  //   import InfiniteCanvas from "../src/CanvasInteractable.svelte";
  //   import CanvasElement from "../src/CanvasElement.svelte";
  //   import CanvasElementLink from "../src/CanvasElementLink.svelte";
  import Canvas from "../src/Canvas.svelte";
  import Unit from "./Unit.svelte";
  import Inner from "./Inner.svelte";

  let data = [
    {
      id: "one",
      x: 20,
      y: 150,
      text:
        "<h1>This is a zoomable and pannable canvas which holds movable and linkable elements.</h1>",
      links: ["two", "four"],
    },
    {
      id: "two",
      x: 400,
      y: 20,
      text:
        "These elements can link together. Form new links by clicking on the box to the right of this text and selecting an element to link to.",
      links: [],
    },
    {
      id: "three",
      x: 700,
      y: 200,
      text:
        "You can render <em>any</em> html you want, like <code>code</code> or <strong>big, bold text</strong> ",
      links: [],
    },
    {
      id: "four",
      x: 470,
      y: 300,
      text: "It's very extensible",
      links: ["three", "five"],
    },
    {
      id: "five",
      x: 700,
      y: 370,
      props: {
        description:
          "you can even render your own components and pass in props",
        placeholder: "like this prop!",
      },
      links: [],
    },
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
      OuterComponent={Unit}
      InnerComponent={Inner}
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
