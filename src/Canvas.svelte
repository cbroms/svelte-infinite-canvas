<script>
  import CanvasElementLink from "./CanvasElementLink.svelte";
  import CanvasInteractable from "./CanvasInteractable.svelte";
  import MousePositionElement from "./MousePositionElement.svelte";
  import CanvasElement from "./CanvasElement.svelte";
  import { createEventDispatcher } from "svelte";

  import { linking } from "./stores/linking";
  import { dragging } from "./stores/dragging";
  import { position } from "./stores/position";
  import { zoom } from "./stores/zoom";

  const dispatch = createEventDispatcher();

  export let data;
  export let OuterComponent;
  export let LineComponent;
  export let InnerComponent = null;
  export let LineAnnotationComponent = null;
  export let panzoomInstance = null;

  export let x;
  export let y;

  $: {
    if ($linking.end) {
      dispatch("linkend", { from: $linking.start, to: $linking.end });
      linking.set({});
    } else if (
      $linking.start &&
      $linking.x === undefined &&
      $linking.y === undefined
    ) {
      dispatch("linkstart", { from: $linking.start });
    }
  }

  $: {
    if ($dragging.dropped) {
      dispatch("dragend", { id: $dragging.id, x: $dragging.x, y: $dragging.y });
      dragging.set({});
    } else if (
      $dragging.id &&
      $dragging.x === undefined &&
      $dragging.y === undefined
    ) {
      dispatch("dragstart", { id: $dragging.id });
    }
  }

  $: {
    if ($position) {
      const parts = $position.split(",");
      const thisX = -1 * parseInt(parts[4]) * (1 / $zoom);
      const thisY = -1 * parseInt(parts[5]) * (1 / $zoom);
      dispatch("offsetchange", { x: thisX, y: thisY });
    }
  }
</script>

<CanvasInteractable {x} {y} bind:panzoomInstance>
  <div slot="content">
    {#each data as element}
      <CanvasElement {OuterComponent} {InnerComponent} {...element} />
      {#each element.links as link}
        <CanvasElementLink
          from={element.id}
          to={link.id}
          lineProps={link.props}
          {LineComponent}
          {LineAnnotationComponent}
        />
      {/each}
    {/each}
    {#if $linking.start}
      <MousePositionElement />
      <CanvasElementLink
        from={$linking.start}
        to="mouse-position"
        {LineComponent}
      />
    {/if}
  </div>
  <div slot="controls"><slot name="controls" /></div>
</CanvasInteractable>
