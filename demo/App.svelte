<script>
  //   import InfiniteCanvas from "../src/CanvasInteractable.svelte";
  //   import CanvasElement from "../src/CanvasElement.svelte";
  //   import CanvasElementLink from "../src/CanvasElementLink.svelte";
  import { onMount } from "svelte";
  import Canvas from "../src/Canvas.svelte";
  import Unit from "./Unit.svelte";
  import Inner from "./Inner.svelte";
  import Line from "./Line.svelte";
  import LineAnnotation from "./LineAnnotation.svelte";

  let areaElt = null;
  let bounds = { width: 0, height: 0 };
  let centerX;
  let centerY;

  onMount(() => {
    const eltBounds = areaElt.getBoundingClientRect();
    bounds = { width: eltBounds.width, height: eltBounds.height };
  });

  let data = [
    {
      id: "one",
      x: 20,
      y: 150,
      text:
        "<h1>(1) This is a zoomable and pannable canvas which holds movable and linkable elements.</h1>",
      links: [
        { id: "two", props: { text: "testing 123" } },
        { id: "four", props: { text: "one to four, baby" } },
      ],
    },
    {
      id: "two",
      x: 400,
      y: 20,
      text:
        "(2) These elements can link together. Form new links by clicking on the box to the right of this text and selecting an element to link to.",
      links: [],
    },
    {
      id: "three",
      x: 700,
      y: 200,
      text:
        "(3) You can render <em>any</em> html you want, like <code>code</code> or <strong>big, bold text</strong> ",
      links: [],
    },
    {
      id: "four",
      x: 470,
      y: 300,
      text: "(4) It's very extensible",
      links: [{ id: "three", props: { text: "four to  three" } }],
    },
    {
      id: "five",
      x: 700,
      y: 370,
      props: {
        description:
          "(5) you can even render your own components and pass in props",
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
        elt.links.push({ id: e.detail.to });
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

  const handleOffset = (e) => {
    centerX = e.detail.x + bounds.width / 2;
    centerY = e.detail.y + bounds.height / 2;
  };

  const handleCreateUnit = () => {
    data = [
      ...data,
      {
        id: data.length + 1,
        x: centerX,
        y: centerY,
        text: "a new unit",
        links: [],
      },
    ];
  };
</script>

<div class="layout">
  <div class="sidebar" />
  <div class="header">
    <button on:click={handleCreateUnit}>Create new unit</button>
  </div>
  <div class="area" bind:this={areaElt}>
    <Canvas
      {data}
      OuterComponent={Unit}
      InnerComponent={Inner}
      LineComponent={Line}
      LineAnnotationComponent={LineAnnotation}
      on:linkstart={handleLinkStart}
      on:linkend={handleLinkEnd}
      on:dragstart={handleDragStart}
      on:dragend={handleDragEnd}
      on:offsetchange={handleOffset}
      x={2000}
      y={2000}
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
    background-color: white;
  }

  .header {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    background-color: white;
  }

  .area {
    border: 1px solid black;
    overflow: hidden;
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }
</style>
