<script>
  import Select from "svelte-select";
  import { ascending } from "d3";
  export let data;
  export let filters;

  // $: console.log(filters);
</script>

<!-- <strong class="font-robotoCondensed">to zoom in</strong> -->
<div class="whitespace-nowrap selector flex flex-row items-center">
  <!-- <strong class="font-robotoCondensed">Select</strong> -->
  <span class="inline-block w-full">
    <Select
      class=""
      placeholder="Select Jurisdiction"
      items={data}
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
    --background: rgb(209 213 219);
    --inputFontSize: 1em;
    --inputColor: #000;
    --placeholderColor: #000;
    --indicatorTop: 5px;
    --indicatorColor: #000;
    --clearSelectColor: #000;
    --clearSelectHoverColor: #000;
    --clearSelectFoucsColor: #000;
    --padding: 10px;
    /* --margin: 5px; */
  }
</style>
