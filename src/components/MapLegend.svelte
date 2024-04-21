<script>
  import { legendTooltipData, selectedColoringScheme } from "../stores/ui.js";

  import {
    instrumentColors,
    instrumentGroups,
    regionColors,
    regionGroups,
    incomeColors,
    incomeGroups,
    levelColors,
    levelGroups,
  } from "$data/config.js";

  $: console.log($selectedColoringScheme);
  $: console.log("legendTooltipData", $legendTooltipData);

  const showTooltip = (cat) => {
    return function handleMousemoveFn(e) {
      legendTooltipData.set({
        pos: {
          x: e.layerX,
          y: e.layerY + 100,
        },
        legend: cat.description,
      });
    };
  };
  const hideTooltip = () => legendTooltipData.set(null);
</script>

<div class="bg-purple-400">
  <div class="mb-2 text-base lg:text-lg">
    Jurisdictions colored by <select
      bind:value={$selectedColoringScheme}
      class="rounded-md px-2 py-1 bg-gray-200"
    >
      <option value="instrument">Instrument</option>
      <option value="region">Region</option>
      <option value="income">Income</option>
      <option value="level">Level</option>
    </select>
  </div>
  <div class="flex flex-row flex-wrap justify-between text-sm lg:text-base">
    {#if $selectedColoringScheme === "instrument"}
      {#each instrumentGroups as cat, i}
        <div
          class="flex items-center mr-2 mb-2 cursor-pointer hover:font-bold"
          on:mouseover={showTooltip(cat)}
          on:focus={showTooltip(cat)}
          on:mouseout={hideTooltip}
          on:blur={hideTooltip}
        >
          <span
            class="inline-block w-5 h-5 mr-1"
            style="background-color:{instrumentColors[i]}"
          ></span>
          <span class="pointer-events-none">{cat.label}</span>
        </div>
      {/each}
    {/if}

    {#if $selectedColoringScheme === "region"}
      {#each regionGroups as cat, i}
        <div class="flex items-center mr-2 mb-2">
          <span
            class="inline-block w-5 h-5 mr-1"
            style="background-color:{regionColors[i]}"
          ></span>
          <span class="pointer-events-none">{cat.label}</span>
        </div>
      {/each}
    {/if}

    {#if $selectedColoringScheme === "income"}
      {#each incomeGroups as cat, i}
        <div class="flex items-center mr-2 mb-2">
          <span
            class="inline-block w-5 h-5 mr-1"
            style="background-color:{incomeColors[i]}"
          ></span>
          <span class="pointer-events-none">{cat.label}</span>
        </div>
      {/each}
    {/if}

    {#if $selectedColoringScheme === "level"}
      {#each levelGroups as cat, i}
        <div class="flex items-center mr-2 mb-2">
          <span
            class="inline-block w-5 h-5 mr-1"
            style="background-color:{levelColors[i]}"
          ></span>
          <span class="pointer-events-none">{cat.label}</span>
        </div>
      {/each}
    {/if}
  </div>
</div>

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