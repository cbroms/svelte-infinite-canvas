<script>
  import LeaderLine from "./utils/leader-line.min.js";
  import { linkedElements } from "./stores/linkedElements";
  import { dragging } from "./stores/dragging";
  import { position } from "./stores/position";
  import { zoom } from "./stores/zoom";

  export let from;
  export let to;

  let line = null;

  $: {
    if (line === null) {
      if ($linkedElements[from] && $linkedElements[to]) {
        setTimeout(() => {
          line = new LeaderLine($linkedElements[from], $linkedElements[to]);
          line.setOptions({ startSocket: "right", endSocket: "left" });
        }, 200);
      }
    }
  }

  $: {
    if ($dragging.id === from || $dragging.id === to) {
      line.position();
    }
  }

  $: {
    if (line && ($zoom || $position)) {
      line.position();
    }
  }
</script>
