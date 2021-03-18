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

    const x = element.offsetLeft - thisX * (1 / $zoom);
    const y = element.offsetTop - thisY * (1 / $zoom);

    linking.update((s) => {
      return {
        ...s,
        y,
        x,
      };
    });

    linkedElements.update((elts) => {
      return { ...elts, "mouse-position": { element, x, y } };
    });
  };

  const linkUp = (e) => {
    let linked = false;

    for (const elt in $linkedElements) {
      console.log(elt);
      // did we drop over an element?
      if (
        $linking.x > $linkedElements[elt].element.offsetLeft &&
        $linking.x <
          $linkedElements[elt].element.offsetLeft +
            $linkedElements[elt].element.offsetWidth &&
        $linking.y > $linkedElements[elt].element.offsetTop &&
        $linking.y <
          $linkedElements[elt].element.offsetTop +
            $linkedElements[elt].element.offsetHeight
      ) {
        if (elt !== $linking.start) {
          document.onmousemove = null;
          // make the connection
          linking.update((s) => {
            return { ...s, end: elt };
          });
          linked = true;
        } else {
          linked = true;
        }
      }
    }

    if (!linked) {
      linking.set({});
      document.onmousemove = null;
    }
  };

  onMount(() => {
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
    position: absolute;
  }
</style>
