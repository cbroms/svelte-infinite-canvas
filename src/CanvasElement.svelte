<script>
  import { linkedElements } from "./stores/linkedElements";
  import { dragging } from "./stores/dragging";
  import { linking } from "./stores/linking";
  import { zoom } from "./stores/zoom";

  import { onMount } from "svelte";

  export let x = 0;
  export let y = 0;
  export let id;
  export let text = null;
  export let props = null;
  export let OuterComponent;
  export let InnerComponent;

  let oldX, oldY, thisX, thisY;

  let element = null;
  let linkStarterElt = null;

  onMount(() => {
    linkedElements.update((elts) => {
      return { ...elts, [id]: { element, x, y } };
    });
  });

  const dragEnd = (e) => {
    document.onmouseup = null;
    document.onmousemove = null;
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

    y = element.offsetTop - thisY * (1 / $zoom);
    x = element.offsetLeft - thisX * (1 / $zoom);

    dragging.set({
      y,
      x,
      id,
    });
    linkedElements.update((elts) => {
      return { ...elts, [id]: { element, x, y } };
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
    e.preventDefault();
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
  style="top: {y}px; left: {x}px;"
>
  <svelte:component this={OuterComponent}>
    <div
      slot="grippable"
      class="slot-filler-elt grabber"
      class:grabbed={$dragging.id === id}
      on:mousedown={dragStart}
    />
    <div slot="text">
      {#if text}
        {@html text}
      {:else if props}
        <svelte:component this={InnerComponent} {...props} />
      {/if}
    </div>
    <div
      bind:this={linkStarterElt}
      slot="linkStarter"
      class="slot-filler-elt starter"
      on:mousedown={linkStart}
    />
  </svelte:component>
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
