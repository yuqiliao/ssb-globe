<script>
  import Globe from "./components/Globe.svelte";
  //   import Tooltip from "./components/Tooltip.svelte";
  import MapFilter from "./components/MapFilter.svelte";
  import MapDetails from "./components/MapDetails.svelte";
  import MapLegend from "./components/MapLegend.svelte";
  import Tooltip from "./components/Tooltip.svelte";
  import {
    tooltipData,
    tooltipData2,
    legendTooltipData,
    selectedColoringScheme,
  } from "./stores/ui.js";
  import { csv, autoType, ascending } from "d3";
  import LegendTooltip from "./components/LegendTooltip.svelte";

  // Subscribe to changes in selectedColoringSchemeStore and update selectedColoringScheme accordingly

  $: console.log($selectedColoringScheme);

  let databasePath = "src/data/database.csv";
  let taxData = [];
  csv(databasePath, autoType).then((data) => {
    taxData = data
      .map((d) => ({
        ...d,
        value: d.jurisdiction,
        label: d.jurisdiction,
      }))
      .sort((a, b) => ascending(a.value, b.value));
    console.log(taxData);
  });

  let selectedJurisdiction;
  $: console.log(selectedJurisdiction);

  $: console.log($tooltipData);
  // Import any necessary Svelte components or data here
</script>

<div
  class="py-2 px-6 md:px-12 lg:px-24 xl:px-32 mx-auto flex flex-col sm:flex-row justify-center bg-red-400"
>
  <!-- Left/top side (rotating globe) -->
  <div class="px-6 md:px-12 lg:px-24 xl:px-32 w-full sm:w-2/3 bg-yellow-400">
    <!-- Place your rotating globe component here -->
    <div class="m-4">
      <Globe />
    </div>
    <div class="m-4">
      <MapLegend />
    </div>
    {#if $tooltipData2}
      <Tooltip />
    {/if}
    <LegendTooltip slot="legendtooltip">
      {#if $legendTooltipData && $legendTooltipData.legend}
        <div>
          {$legendTooltipData.legend}
        </div>
      {/if}
    </LegendTooltip>
  </div>

  <!-- Right/bottom side (panel) -->
  <div class="w-full sm:w-1/3 bg-green-400">
    <!-- Panel content -->
    <div class="m-4 bg-orange-400">
      <h2 class="text-lg font-semibold">Selected Jurisdiction</h2>
      <MapFilter data={taxData} bind:filters={$tooltipData} />
    </div>
    <div class="m-4 bg-pink-400">
      <MapDetails item={$tooltipData} />
    </div>
  </div>
</div>

<style>
</style>
