<script>
  import Globe from "./components/Globe.svelte";
  //   import Tooltip from "./components/Tooltip.svelte";
  import MapFilter from "./components/MapFilter.svelte";
  import MapDetails from "./components/MapDetails.svelte";
  import MapLegend from "./components/MapLegend.svelte";
  import Tooltip from "./components/Tooltip.svelte";
  import LegendTooltip from "./components/LegendTooltip.svelte";

  import {
    tooltipData,
    tooltipData2,
    legendTooltipData,
    selectedColoringScheme,
  } from "./stores/ui.js";
  import { csv, autoType, ascending } from "d3";

  // Subscribe to changes in selectedColoringSchemeStore and update selectedColoringScheme accordingly

  // $: console.log($selectedColoringScheme);

  let databasePath = "database.csv";
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
  // $: console.log(selectedJurisdiction);

  // $: console.log($tooltipData);
  // Import any necessary Svelte components or data here
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- add an on:click event to set tooltipData as null (except for when the Globe area is clicked) -->
<div
  class="py-4 mr-6 md:mr-12 lg:mr-24 xl:mr-32 px-6 md:px-12 lg:px-24 xl:px-32 mx-auto flex flex-col sm:flex-row justify-center"
  on:click={(event) => {
    // Check if the click target is not the Globe component
    if (
      !event.target.closest(".globe-component") &&
      !event.target.closest(".right-panel")
    ) {
      // If not the Globe component, set tooltipData to null
      tooltipData.set(null);
    }
  }}
>
  <!-- Left/top side (rotating globe) -->
  <div class="px-6 md:px-12 lg:px-24 xl:px-32 w-full sm:w-2/3">
    <!-- Place your rotating globe component here -->
    <div class="m-4 globe-component">
      <Globe />
    </div>
    <div class="m-4 p-4 rounded-md bg-gray-100">
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
  <div class="mb-4 w-full sm:w-1/3 rounded-md bg-gray-100 right-panel">
    <!-- Panel content -->
    <div class="m-4">
      <h3 class="my-2 text-xl lg:text-2xl font-semibold text-center">
        SSB tax coverage
      </h3>
      <MapFilter data={taxData} bind:filters={$tooltipData} />
    </div>
    <div class="py-2 m-4">
      <MapDetails item={$tooltipData} />
    </div>
    <div class="mt-4 mx-4 text-xs text-gray-800">
      <div>
        Source: <a
          class="underline"
          href="https://datacatalog.worldbank.org/search/dataset/0063310"
          target="”_blank”">Global SSB Tax Database</a
        >
      </div>
      <div>
        Made with ♡ by <a
          class="underline"
          href="https://www.yuqiliao.com/"
          target="”_blank”">Yuqi Liao</a
        >
      </div>
    </div>
  </div>
</div>

<style>
</style>
