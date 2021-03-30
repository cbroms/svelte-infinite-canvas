<script>
  import { slide } from "svelte/transition";
  export let description = "";
  export let placeholder = "";

  let active = false;
</script>

<div class="inner-thingy">
  {#if active}
    <div transition:slide>
      Something secret and hidden<br />Something secret and hidden<br
      />Something secret and hidden<br />Something secret and hidden
    </div>
  {/if}
  <button
    on:click={() => {
      active = !active;
    }}>{!active ? "Show" : "Hide"}</button
  >
  <p>{description}</p>
  <input {placeholder} />
</div>

<style>
  .inner-thingy {
    padding: 10px;
    font-family: cursive;
    background-color: lightgrey;
  }
</style>
