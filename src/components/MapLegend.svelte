<script>
  export let instrumentGroups;
  export let instrumentColors;
  import { tooltipData } from "../stores/ui.js";
</script>

<div class="flex flex-row flex-wrap justify-between text-sm">
  {#each instrumentGroups as cat, i}
    <div class="flex items-center mr-2 mb-2">
      <span
        class="inline-block w-5 h-5 mr-1"
        style="background-color:{instrumentColors[i]}"
      ></span>
      <span class="pointer-events-none">{cat.label}</span>
    </div>
  {/each}
</div>
