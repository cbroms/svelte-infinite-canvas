<script>
  import CanvasElementLink from "./CanvasElementLink.svelte";
  import CanvasInteractable from "./CanvasInteractable.svelte";
  import MousePositionElement from "./MousePositionElement.svelte";
  import CanvasElement from "./CanvasElement.svelte";
  import { createEventDispatcher } from "svelte";

  import { linking } from "./stores/linking";
  import { dragging } from "./stores/dragging";

  const dispatch = createEventDispatcher();

  export let showControls;
  export let data;
  export let OuterComponent;
  export let InnerComponent;
  export let LineComponent;
  export let LineAnnotationComponent;

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
</script>

<CanvasInteractable {x} {y}>
  {#each data as element}
    <CanvasElement
      {OuterComponent}
      {InnerComponent}
      {...element}
      {showControls}
    />
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
</CanvasInteractable>
