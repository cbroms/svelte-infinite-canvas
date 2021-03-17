<script>
  import { linkedElements } from "./stores/linkedElements";
  import { dragging } from "./stores/dragging";
  import { linking } from "./stores/linking";
  import { position } from "./stores/position";
  import { zoom } from "./stores/zoom";

  export let from = null;
  export let to = null;
  export const options = {
    startSocket: "right",
    endSocket: "left",
    endPlug: "square",
    color: "black",
    size: 2,
  };

  let height = 0;
  let width = 0;
  let x = 0;
  let y = 0;

  let lineX1 = 0;
  let lineX2 = 0;
  let lineY1 = 0;
  let lineY2 = 0;

  $: {
    // recalculate when linked elements updates, or one of the ends is being dragged
    if (
      $linkedElements[to] &&
      $linkedElements[from] &&
      ($dragging.id === undefined ||
        $dragging.id === from ||
        $dragging.id === to)
    ) {
      // TODO: this doesn't work when the elements  render off screen, since everything is relative to the viewport
      const fromPos = $linkedElements[from].element.getBoundingClientRect();
      const toPos = $linkedElements[to].element.getBoundingClientRect();
      console.log(fromPos.width, toPos.width);

      // adjust the start and end positions to take into account the size of the element and zoom level
      const adjustedFromX =
        $linkedElements[from].x + fromPos.width * (1 / $zoom);
      const adjustedFromY =
        $linkedElements[from].y + (fromPos.height * (1 / $zoom)) / 2;
      const adjustedToY =
        $linkedElements[to].y + (toPos.height * (1 / $zoom)) / 2;

      height = Math.abs(adjustedToY - adjustedFromY);
      width = Math.abs($linkedElements[to].x - adjustedFromX);

      if (adjustedToY < adjustedFromY) {
        // top to bottom
        lineY1 = height;
        lineY2 = 0;
        y = adjustedToY;
      } else {
        // bottom to top
        lineY1 = 0;
        lineY2 = height;
        y = adjustedFromY;
      }

      if ($linkedElements[to].x < adjustedFromX) {
        x = $linkedElements[to].x;
        lineX1 = width;
        lineX2 = 0;
      } else {
        x = adjustedFromX;
        lineX2 = width;
        lineX1 = 0;
      }
    }
  }
</script>

{#if $linkedElements[to] && $linkedElements[from]}
  <svg
    class="{from} to {to}"
    viewBox="0 0 {width} {height}"
    xmlns="http://www.w3.org/2000/svg"
    style="height: {height}px; width: {width}px; left: {x}px; top: {y}px;"
  >
    <line x1={lineX1} y1={lineY1} x2={lineX2} y2={lineY2} stroke="black" />
  </svg>
{/if}

<style>
  svg {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
