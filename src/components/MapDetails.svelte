<script>
  export let item;

  import carbonatesIcon from "$images/Carbonates.svg";
  import concentratesIcon from "$images/ConcentratesAndSyrups.svg";
  import energyIcon from "$images/EnergyDrinks.svg";
  import dietIcon from "$images/DietDrinks.svg";
  import milkIcon from "$images/Milk.svg";
  import sweetenedIcon from "$images/SweetenedJuices.svg";
  import unsweetenedIcon from "$images/UnsweetenedJuices.svg";

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

    // console.log("item", item);

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

<div class="mb-4 text-sm lg:text-base">
  {#if tooltipContent}
    <div>
      {#if item?.jurisdiction}
        <strong class="font-bold">{tooltipContent.title}</strong> has an SSB tax
        implemented <strong class="font-bold">since {item.year_imp}</strong>.
        Its SSB tax covers the following
        <span class="underline">beverage types</span>.
      {:else}
        {tooltipContent.title} does not have an SSB tax implemented
      {/if}
    </div>
  {:else}
    <div
      class="animate-bounce animate-twice animate-duration-[2000ms] animate-ease-in-out"
    >
      Select a jurisdiction from the dropdown menu or from the globe to learn
      more!
    </div>
  {/if}
</div>

<div class="flex flex-col">
  <div class="-m-1.5 overflow-x-auto">
    <div class="p-1.5 min-w-full">
      <div class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each categories as { label, icon, value }}
              <tr>
                <td
                  class="text-right align-middle px-2 py-2 w-1/3 text-sm lg:text-base font-medium text-gray-800 dark:text-gray-800"
                  >{label}</td
                >
                <td class="px-2 py-2 text-sm text-gray-800 dark:text-gray-200"
                  ><img
                    class="w-8 h-8 sm:w-10 sm:h-10 mt-1"
                    src={icon}
                    alt={label}
                  /></td
                >
                <td
                  class="px-2 py-2 text-sm text-gray-800 dark:text-gray-200 align-middle"
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
