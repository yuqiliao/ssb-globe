<script>
  import { tooltipData, legendTooltipData } from "../stores/ui.js";
  import { format } from "d3-format";

  export let visible = true;
  let windowWidth;

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

<svelte:window bind:innerWidth={windowWidth} />
<div>
  <!-- {#if tooltipContent}
    <div>
      <h2>{tooltipContent.title}</h2>
      <h3>Population of {suffixFormat(tooltipContent.population)}</h3>
    </div>
  {/if} -->

  {#if visible && $legendTooltipData && $legendTooltipData.pos && $legendTooltipData.pos.x}
    {console.log("this should work")}
    <div
      class="absolute bg-white/90 p-2 min-w-[100px] max-w-[200px] -translate-x-1/2 pointer-events-none rounded-lg shadow-2xl"
      style="
      left: {$legendTooltipData.pos.x - 50 > 0
        ? $legendTooltipData.pos.x + 100 < windowWidth
          ? $legendTooltipData.pos.x
          : $legendTooltipData.pos.x - 50
        : $legendTooltipData.pos.x + 50}px; 
      top:{$legendTooltipData.pos.y - 50 > 0
        ? $legendTooltipData.pos.y - 50
        : $legendTooltipData.pos.y}px;"
    >
      <slot />
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
