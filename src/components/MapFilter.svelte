<script>
  import Select from "svelte-select";
  import { ascending } from "d3";
  export let data;
  export let filters;

  const jurisdictions = data
    .map((d) => ({
      ...d,
      value: d.jurisdiction,
      label: d.jurisdiction,
    }))
    .sort((a, b) => ascending(a.value, b.value));

  console.log(jurisdictions);
</script>

<!-- <strong class="font-robotoCondensed">to zoom in</strong> -->
<div class="mt-2 whitespace-nowrap selector flex flex-row items-center">
  <!-- <strong class="font-robotoCondensed">Select</strong> -->
  <span class="inline-block w-full lg:w-60">
    <Select
      class=""
      placeholder="Select Jurisdiction"
      items={jurisdictions}
      bind:value={filters}
    />
  </span>
</div>

<!-- <strong class="font-robotoCondensed">to show details</strong> -->

<style>
  .selector {
    --border: none;
    --borderRadius: 5px;
    --itemFirstBorderRadius: 0px;
    --listBorderRadius: 0px;
    --itemHoverBG: #ccc;
    --borderFocusColor: #000;
    --background: rgb(234, 234, 234);
    --inputFontSize: 1em;
    --inputColor: #000;
    --placeholderColor: #000;
    --indicatorTop: 5px;
    --indicatorColor: #000;
    --clearSelectColor: #000;
    --clearSelectHoverColor: #000;
    --clearSelectFoucsColor: #000;
    --padding: 10px;
    --margin: 5px;
  }
</style>
