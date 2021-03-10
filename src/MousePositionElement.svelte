<script>
  import { linkedElements } from "./stores/linkedElements";
  import { linking } from "./stores/linking";
  import { onMount, onDestroy } from "svelte";
  import { zoom } from "./stores/zoom";

  let oldX, oldY, thisX, thisY;

  let element = null;

  const linkDuring = (e) => {
    e.preventDefault();
    thisX = oldX - e.clientX;
    thisY = oldY - e.clientY;
    oldX = e.clientX;
    oldY = e.clientY;

    linking.update((s) => {
      return {
        ...s,
        y: element.offsetTop - thisY * (1 / $zoom),
        x: element.offsetLeft - thisX * (1 / $zoom),
      };
    });
  };

  const linkUp = (e) => {
    for (const elt in $linkedElements) {
      // did we drop over an element?
      if (
        $linking.x > $linkedElements[elt].offsetLeft &&
        $linking.x <
          $linkedElements[elt].offsetLeft + $linkedElements[elt].offsetWidth &&
        $linking.y > $linkedElements[elt].offsetTop &&
        $linking.y <
          $linkedElements[elt].offsetTop + $linkedElements[elt].offsetHeight
      ) {
        if (elt !== $linking.start) {
          document.onmousemove = null;
          // make the connection
          linking.update((s) => {
            return { ...s, end: elt };
          });
        }
      }
    }
  };

  onMount(() => {
    linkedElements.update((elts) => {
      return { ...elts, "mouse-position": element };
    });
    document.onmousemove = linkDuring;
    document.onmouseup = linkUp;
  });

  onDestroy(() => {
    linkedElements.update((elts) => {
      const res = { ...elts };
      delete res["mouse-position"];
      return res;
    });
  });
</script>

<div
  bind:this={element}
  class="mouse-position"
  style="top: {$linking.y}px; left: {$linking.x}px;"
/>

<style>
  .mouse-position {
    pointer-events: none;
    height: 10px;
    width: 10px;
    background-color: red;
    position: absolute;
  }
</style>
