<script>
  import CanvasElementLink from "./CanvasElementLink.svelte";
  import CanvasInteractable from "./CanvasInteractable.svelte";
  import CanvasElement from "./CanvasElement.svelte";

  export let data;
  export let Unit;
</script>

<CanvasInteractable>
  {#each data as element}
    <CanvasElement id={element.id} x={element.x} y={element.y}>
      <Unit>
        <div slot="text">{element.text}</div>
        <div slot="linkStarter" />
      </Unit>
    </CanvasElement>
    {#each element.links as link}
      <CanvasElementLink from={element.id} to={link} />
    {/each}
  {/each}
</CanvasInteractable>
