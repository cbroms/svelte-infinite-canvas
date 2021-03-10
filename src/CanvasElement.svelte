<script>
  import { linkedElements } from "./stores/linkedElements";
  import { dragging } from "./stores/dragging";
  import { linking } from "./stores/linking";
  import { zoom } from "./stores/zoom";

  import { onMount } from "svelte";

  export let x = 0;
  export let y = 0;
  export let id;
  export let text = "";
  export let Unit;

  let oldX, oldY, thisX, thisY;

  let element = null;
  let linkStarterElt = null;

  onMount(() => {
    linkedElements.update((elts) => {
      return { ...elts, [id]: element };
    });
  });

  const dragEnd = (e) => {
    document.onmouseup = null;
    document.onmousemove = null;
    x = $dragging.x;
    y = $dragging.y;
    dragging.update((s) => {
      return { ...s, dropped: true };
    });
  };

  const dragDuring = (e) => {
    e.preventDefault();
    thisX = oldX - e.clientX;
    thisY = oldY - e.clientY;
    oldX = e.clientX;
    oldY = e.clientY;

    dragging.set({
      y: element.offsetTop - thisY * (1 / $zoom),
      x: element.offsetLeft - thisX * (1 / $zoom),
      id,
    });
  };

  const dragStart = (e) => {
    e.preventDefault();
    oldX = e.clientX;
    oldY = e.clientY;

    document.onmousemove = dragDuring;

    document.onmouseup = dragEnd;
    dragging.set({ id });
  };

  const linkStart = (e) => {
    linking.set({ start: id });
    linking.set({
      start: id,
      x: element.offsetLeft + linkStarterElt.offsetLeft,
      y: element.offsetTop + linkStarterElt.offsetTop,
    });
  };

  const linkEnd = (e) => {
    if ($linking.start && $linking.start !== id) {
      document.onmousemove = null;
      // make the connection
      linking.update((s) => {
        return { ...s, end: id };
      });
    }
  };
</script>

<div
  on:click={linkEnd}
  bind:this={element}
  class="canvas-element"
  style="top: {($dragging.id === id && $dragging.y) ||
    y}px; left: {($dragging.id === id && $dragging.x) || x}px;"
>
  <Unit>
    <div
      slot="grippable"
      class="slot-filler-elt grabber"
      class:grabbed={$dragging.id === id}
      on:mousedown={dragStart}
    />
    <div slot="text">{text}</div>
    <div
      bind:this={linkStarterElt}
      slot="linkStarter"
      class="slot-filler-elt starter"
      on:mousedown={linkStart}
    />
  </Unit>
</div>

<style>
  .slot-filler-elt {
    height: 100%;
    width: 100%;
  }

  .grabber {
    cursor: grab;
  }

  .starter {
    cursor: crosshair;
  }
  .canvas-element {
    position: absolute;
  }

  .grabbed {
    cursor: grabbing;
  }
</style>
