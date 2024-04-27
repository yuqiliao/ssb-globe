<script>
  import { tooltipData2 } from "../stores/ui.js";

  let windowWidth;

  let tooltipContent = null;

  $: {
    if ($tooltipData2) {
      if ($tooltipData2.jurisdiction) {
        tooltipContent = {
          title: $tooltipData2.jurisdiction,
        };
      } else if ($tooltipData2.properties) {
        tooltipContent = {
          title: $tooltipData2.properties.BRK_NAME,
        };
      } else {
        tooltipContent = null;
      }
    } else {
      tooltipContent = null;
    }
  }
</script>

<svelte:window bind:innerWidth={windowWidth} />
<div>
  {#if tooltipContent}
    <div
      class="absolute bg-white/90 p-2 min-w-[100px] max-w-[200px] -translate-x-1/2 pointer-events-none rounded-lg shadow-2xl"
      style="
      left: {$tooltipData2.mouseX - 100 > 0
        ? $tooltipData2.mouseX + 100 < windowWidth
          ? $tooltipData2.mouseX
          : $tooltipData2.mouseX - 50
        : $tooltipData2.mouseX + 50}px; 
      top:{$tooltipData2.mouseY - 50 > 0
        ? $tooltipData2.mouseY - 50
        : $tooltipData2.mouseY}px;"
    >
      <h2>{tooltipContent.title}</h2>
    </div>
  {/if}
</div>
