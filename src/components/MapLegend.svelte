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
  } from "/public/config.js";

  // $: console.log($selectedColoringScheme);
  // $: console.log("legendTooltipData", $legendTooltipData);

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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="">
  <div class="mb-2 text-base font-semibold lg:text-lg">
    Jurisdictions colored by <select
      bind:value={$selectedColoringScheme}
      class="rounded-md px-2 py-1 bg-gray-300"
    >
      <option value="instrument">Instrument</option>
      <option value="region">Region</option>
      <option value="income">Income Level</option>
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
      <div class="text-xs text-gray-800">
        Based on <a
          class="underline"
          href="https://datahelpdesk.worldbank.org/knowledgebase/articles/906519-world-bank-country-and-lending-groups"
          target="”_blank”">World Bank region categorizations</a
        >
      </div>
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
      <div class="text-xs text-gray-800">
        Based on <a
          class="underline"
          href="https://datahelpdesk.worldbank.org/knowledgebase/articles/906519-world-bank-country-and-lending-groups"
          target="”_blank”">World Bank Income Level categorizations</a
        >
      </div>
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
