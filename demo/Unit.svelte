<div class="unit">
  <div class="grippable"><slot name="grippable" /></div>
  <div class="unit-content">
    <div class="text"><slot name="text" /></div>
    <div class="starter"><slot name="linkStarter" /></div>
  </div>
</div>

<style>
  .unit {
    background-color: pink;
    border: 1px solid purple;
  }

  .unit-content {
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

  .grippable {
    height: 10px;
    background-color: grey;
  }
</style>
