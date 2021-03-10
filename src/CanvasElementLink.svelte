<script>
  import { onDestroy } from "svelte";
  //   import LeaderLine from "./utils/leader-line.min.js";
  import LeaderLine from "leader-line";
  import { linkedElements } from "./stores/linkedElements";
  import { dragging } from "./stores/dragging";
  import { linking } from "./stores/linking";
  import { position } from "./stores/position";
  import { zoom } from "./stores/zoom";

  export let from = null;
  export let to = null;

  let line = null;

  onDestroy(() => {
    if (line) {
      line.remove();
    }
  });

  $: {
    if (line === null) {
      // if both from and to have been populated, render the link
      if ($linkedElements[from] && $linkedElements[to]) {
        setTimeout(() => {
          line = new LeaderLine($linkedElements[from], $linkedElements[to]);
          line.setOptions({
            startSocket: "right",
            endSocket: "left",
            endPlug: "arrow3",
          });
        }, 200);
      }
    }
  }

  $: {
    // if we're dragging one of the connected units, adjust link position
    if (line && ($dragging.id === from || $dragging.id === to)) {
      line.position();
    }
  }

  $: {
    // if we're in link mode , adjust link position
    if (line && $linking.start === from && to === "mouse-position") {
      line.position();
    }
  }

  $: {
    // if we're changing zoom/pan, adjust link position
    if (line && ($zoom || $position)) {
      line.position();
    }
  }
</script>
