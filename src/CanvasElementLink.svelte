<script>
  import { linkedElements } from "./stores/linkedElements";
  import { dragging } from "./stores/dragging";
  import { linking } from "./stores/linking";
  import { position } from "./stores/position";
  import { zoom } from "./stores/zoom";

  export let from = null;
  export let to = null;
  export let LineComponent;
  export let LineAnnotationComponent;
  export let lineProps = {};

  let height = 0;
  let width = 0;
  let x = 0;
  let y = 0;

  let lineX1 = 0;
  let lineX2 = 0;
  let lineY1 = 0;
  let lineY2 = 0;

  let hovering = false;

  const handleLineClick = () => {};

  const handleLineHover = () => {
    hovering = true;
  };

  const handleLineLeave = () => {
    hovering = false;
  };

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

      // adjust the start and end positions to take into account the size of the element and zoom level
      const adjustedFromX = Math.round(
        $linkedElements[from].x + fromPos.width * (1 / $zoom)
      );
      const adjustedFromY = Math.round(
        $linkedElements[from].y + (fromPos.height * (1 / $zoom)) / 2
      );
      const adjustedToY = Math.round(
        $linkedElements[to].y + (toPos.height * (1 / $zoom)) / 2
      );

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
  <svelte:component this={LineComponent}>
    <div slot="line" let:hoverStroke let:stroke let:color let:hoverColor>
      <svg
        viewBox="0 0 {width} {height + stroke * 2 + 4}"
        xmlns="http://www.w3.org/2000/svg"
        style="height: {height +
          stroke * 2 +
          4}px; width: {width}px; left: {x}px; top: {y}px;"
      >
        <!-- <defs>
          <marker
            id="{from}-{to}"
            orient="auto"
            markerWidth="2"
            markerHeight="4"
            refX="1.5"
            refY="2"
          >
            <path d="M0,0 V4 L2,2 Z" fill={hovering ? hoverColor : color} />
          </marker>
        </defs> -->

        <line
          marker-end="url(#{from}-{to})"
          x1={lineX1}
          y1={lineY1}
          x2={lineX2}
          y2={lineY2 + stroke}
          stroke={hovering ? hoverColor : color}
          stroke-width={hovering ? hoverStroke : stroke}
          on:click={handleLineClick}
          on:mouseover={handleLineHover}
          on:mouseout={handleLineLeave}
        />
      </svg>
    </div>
  </svelte:component>

  {#if hovering}
    <div
      class="line-annotation"
      style="left: {x + width / 2}px; top: {y + height / 2}px;"
    >
      <svelte:component this={LineAnnotationComponent} {...lineProps} />
    </div>
  {/if}
{/if}

<style>
  svg {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
  }

  line {
    pointer-events: all !important;
    cursor: pointer;
  }

  .line-annotation {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
