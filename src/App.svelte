<script>
  import Globe from "./components/Globe.svelte";
  //   import Tooltip from "./components/Tooltip.svelte";
  import MapFilter from "./components/MapFilter.svelte";
  import MapDetails from "./components/MapDetails.svelte";
  import { tooltipData } from "./stores/ui.js";
  import { csv, autoType, ascending } from "d3";

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

<div class="container mx-auto flex flex-row justify-center">
  <!-- Left side (rotating globe) -->
  <div class="w-1/2 p-4">
    <!-- Place your rotating globe component here -->
    <div class="border border-gray-300 rounded-md h-96">
      Rotating Globe Component
      <Globe bind:selectedJurisdiction />
    </div>
  </div>

  <!-- Right side (panel) -->
  <div class="w-1/2 p-4">
    <!-- Panel content -->
    <div class="border border-gray-300 rounded-md p-4 h-96">
      <h2 class="text-lg font-semibold mb-4">Jurisdiction Information</h2>

      <MapFilter data={taxData} bind:filters={selectedJurisdiction} />
      <div>
        <MapDetails item={selectedJurisdiction} />
      </div>
    </div>
  </div>
</div>

<style>
</style>
