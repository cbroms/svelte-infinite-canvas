<script>
  export let description = "";
  export let placeholder = "";
</script>

<div class="inner-thingy">
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
