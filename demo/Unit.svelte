<div class="unit">
  <div class="text"><slot name="text" /></div>
  <div class="starter"><slot name="linkStarter" /></div>
</div>

<style>
  .unit {
    background-color: pink;
    border: 1px solid purple;
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .text {
    padding-right: 10px;
  }

  .starter {
    height: 10px;
    width: 10px;
    background-color: purple;
  }
</style>
