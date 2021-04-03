<script>
  //   import InfiniteCanvas from "../src/CanvasInteractable.svelte";
  //   import CanvasElement from "../src/CanvasElement.svelte";
  //   import CanvasElementLink from "../src/CanvasElementLink.svelte";
  import { onMount, afterUpdate } from "svelte";
  import Canvas from "../src/Canvas.svelte";
  import Unit from "./Unit.svelte";
  import Inner from "./Inner.svelte";
  import Line from "./Line.svelte";
  import LineAnnotation from "./LineAnnotation.svelte";

  let areaElt = null;
  let bounds = { width: 0, height: 0 };
  let offsetX = 0;
  let offsetY = 0;
  let scale = 1;
  let panzoomInstance;

  const calculateBounds = () => {
    const eltBounds = areaElt.getBoundingClientRect();
    bounds = { width: eltBounds.width, height: eltBounds.height };
  };

  onMount(() => {
    calculateBounds();
  });

  afterUpdate(() => {
    // calculateBounds();
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
    // what space is detail x y in
    // bounds in pixel space
    offsetX = e.detail.x;
    offsetY = e.detail.y;
    console.log("offset", e.detail.x, e.detail.y, offsetX, offsetY);
  };

  const handleScale = (e) => {
    // offsetX, y in pixel space
    // console.log(e.detail.scale, bounds.width, bounds.height);
    // offsetX *= e.detail.scale;
    // offsetY *= e.detail.scale;
    scale = e.detail.scale;
    console.log("scale", scale);
  };

  const handleCreateUnit = () => {
    data = [
      ...data,
      {
        id: data.length + 1,
        x: offsetX,
        y: offsetY,
        text: "a new unit",
        links: [],
      },
    ];
  };

  const zoomIn = (e) => {
    // unit space
    const centerX = (offsetX + bounds.width / 2) / scale;
    const centerY = (offsetY + bounds.height / 2) / scale;
    const dX = bounds.width / 2 / scale;
    const dY = bounds.height / 2 / scale;
    const top = centerY - dY * 0.8;
    const bottom = centerY + dY * 0.8;
    const left = centerX - dX * 0.8;
    const right = centerX + dX * 0.8;

    // HACK: to cancel animation
    panzoomInstance.zoomTo(centerX, centerY, 1.25); // upper-left corner
    // relative to original

    panzoomInstance.showRectangle({
      top: top,
      bottom: bottom,
      left: left,
      right: right,
    });
  };

  const boundWindow = (e) => {};

  const zoomOut = () => {
    // unit space
    const centerX = (offsetX + bounds.width / 2) / scale;
    const centerY = (offsetY + bounds.height / 2) / scale;
    const dX = bounds.width / 2 / scale;
    const dY = bounds.height / 2 / scale;
    const top = centerY - dY * 1.25;
    const bottom = centerY + dY * 1.25;
    const left = centerX - dX * 1.25;
    const right = centerX + dX * 1.25;

    // HACK: to cancel animation
    panzoomInstance.zoomTo(centerX, centerY, 0.8); // upper-left corner
    // relative to original

    panzoomInstance.showRectangle({
      top: top,
      bottom: bottom,
      left: left,
      right: right,
    });
  };
</script>

<div class="layout">
  <div class="sidebar" />
  <div class="header" />
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
      on:scalechange={handleScale}
      bind:panzoomInstance
      x={2000}
      y={2000}
    >
      <div slot="controls" class="controls">
        <button on:click={handleCreateUnit}>Create new unit</button>
        <div>
          <button on:click={zoomIn}>+ Zoom in</button>
          <button on:click={zoomOut}>- Zoom out</button>
        </div>
      </div>
    </Canvas>
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

  .controls {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .area {
    border: 1px solid black;
    overflow: hidden;
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }

  button {
    margin: 20px 10px;
    padding: 5px 10px;
    cursor: pointer;
    border: 1px solid black;
    font-size: 14px;
  }
</style>
