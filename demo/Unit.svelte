<div class="unit">
  <div class="grippable"><slot name="grippable" /></div>
  <div class="unit-content">
    <div class="text"><slot name="text" /></div>
    <div class="starter"><slot name="linkStarter" /></div>
  </div>
</div>

<style>
  .unit {
    background-color: white;
    border: 1px solid black;
    border-top: none;
  }

  .unit-content {
    display: flex;
    align-items: center;
    /* padding: 10px; */
  }

  .text {
    max-width: 300px;
    padding: 10px;
  }

  .starter {
    height: 25px;
    width: 5px;
    background-color: black;
  }

  .grippable {
    height: 8px;
    background: white
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='2'%3E%3Cline x1='0' y1='0' x2='5' y2='0' stroke='black' stroke-width='2'/%3E%3C/svg%3E")
      repeat bottom right;
  }
</style>
