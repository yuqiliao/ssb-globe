<script>
  import { tooltipData } from "../stores/ui.js";
  import { format } from "d3-format";

  const suffixFormat = (d) => format(".2~s")(d).replace(/G/, "B");

  let tooltipContent = null;

  $: {
    if ($tooltipData) {
      if ($tooltipData.jurisdiction) {
        tooltipContent = {
          title: $tooltipData.jurisdiction,
          population: $tooltipData.population,
        };
      } else if ($tooltipData.properties) {
        tooltipContent = {
          title: $tooltipData.properties.BRK_NAME,
          population: $tooltipData.properties.POP_EST,
        };
      } else {
        tooltipContent = null;
      }
    } else {
      tooltipContent = null;
    }
  }
</script>

<div>
  {#if tooltipContent}
    <div>
      <h2>{tooltipContent.title}</h2>
      <h3>Population of {suffixFormat(tooltipContent.population)}</h3>
    </div>
  {/if}
</div>

<style>
  div {
    position: absolute;
    bottom: 30px;
    right: 100px;
    text-align: right;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: red;
  }

  h3 {
    font-size: 1.15rem;
    font-weight: 200;
    color: purple;
  }
</style>
