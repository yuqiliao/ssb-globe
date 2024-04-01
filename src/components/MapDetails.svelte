<script>
  import { timeFormat } from "d3";
  export let item;
  const formatDate = timeFormat("%Y-%m-%d");

  import carbonatesIcon from "$images/Carbonates.svg";
  import concentratesIcon from "$images/ConcentratesAndSyrups.svg";
  import energyIcon from "$images/EnergyDrinks.svg";
  import dietIcon from "$images/DietDrinks.svg";
  import milkIcon from "$images/Milk.svg";
  import sweetenedIcon from "$images/SweetenedJuices.svg";
  import unsweetenedIcon from "$images/UnsweetenedJuices.svg";

  let selectedContent = null;
  let tooltipContent = null;

  let categories = [];

  $: {
    categories = [
      {
        label: "Sodas",
        icon: carbonatesIcon,
        value: item ? item.carbonates : null,
      },
      {
        label: "Concentrates and syrups",
        icon: concentratesIcon,
        value: item ? item.concentrates : null,
      },
      {
        label: "Energy drinks",
        icon: energyIcon,
        value: item ? item.energy_drinks : null,
      },
      { label: "Diet drinks", icon: dietIcon, value: item ? item.lcsb : null },
      {
        label: "Milk drinks",
        icon: milkIcon,
        value: item ? item.milk_drinks : null,
      },
      {
        label: "Sweetened juices",
        icon: sweetenedIcon,
        value: item ? item.juice_sweetened : null,
      },
      {
        label: "Unsweetened juices",
        icon: unsweetenedIcon,
        value: item ? item.juice_unsweetened : null,
      },
    ];

    if (item) {
      tooltipContent = item.jurisdiction
        ? { title: item.jurisdiction, population: item.population }
        : item.properties
          ? {
              title: item.properties.BRK_NAME,
              population: item.properties.POP_EST,
            }
          : null;
    } else {
      tooltipContent = null;
    }
  }
</script>

{#if tooltipContent}
  <div>
    Selected Jurisdction: {tooltipContent.title}
  </div>

  <div>
    {#if item?.jurisdiction}
      This jurisdiction have ave an SSB tax implemented since {item.year_imp}.
    {:else}
      This jurisdiction does not have an SSB tax implemented
    {/if}
  </div>
{/if}

<div class="flex flex-col">
  <div class="-m-1.5 overflow-x-auto">
    <div class="p-1.5 min-w-full inline-block align-middle">
      <div class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each categories as { label, icon, value }}
              <tr>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-800 text-right"
                  >{label}</td
                >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 text-center"
                  ><img class="w-6 h-6" src={icon} alt={label} /></td
                >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 text-center"
                  >{#if value === 1}<span>✔</span>{/if}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<style>
  td {
    border-bottom: 1px solid #e5e7eb; /* Add underline to each row */
  }
</style>
