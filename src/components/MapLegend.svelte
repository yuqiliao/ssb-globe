<script>
  import { tooltipData, selectedColoringScheme } from "../stores/ui.js";

  import {
    instrumentColors,
    instrumentGroups,
    regionColors,
    regionGroups,
    incomeColors,
    incomeGroups,
  } from "$data/config.js";

  $: console.log($selectedColoringScheme);
</script>

<div>
  Jurisdictions colored by <select bind:value={$selectedColoringScheme}>
    <option value="instrument">Instrument</option>
    <option value="region">Region</option>
    <option value="income">Income</option>
  </select>
</div>
<div class="flex flex-row flex-wrap justify-between text-sm">
  {#if $selectedColoringScheme === "instrument"}
    {#each instrumentGroups as cat, i}
      <div class="flex items-center mr-2 mb-2">
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
</div>
