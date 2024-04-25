<script>
  import { legendTooltipData } from "../stores/ui.js";

  export let visible = true;
  let windowWidth;
</script>

<svelte:window bind:innerWidth={windowWidth} />
<div>
  {#if visible && $legendTooltipData && $legendTooltipData.pos && $legendTooltipData.pos.x}
    <div
      class="absolute bg-white/90 p-2 min-w-[100px] max-w-[200px] -translate-x-1/2 -translate-y-full pointer-events-none rounded-lg shadow-2xl"
      style="
      left: {$legendTooltipData.pos.x - 100 > 0
        ? $legendTooltipData.pos.x + 100 < windowWidth
          ? $legendTooltipData.pos.x
          : $legendTooltipData.pos.x - 50
        : $legendTooltipData.pos.x + 50}px; 
      top:{$legendTooltipData.pos.y - 50 > 0
        ? $legendTooltipData.pos.y - 120
        : $legendTooltipData.pos.y}px;"
    >
      <slot />
    </div>
  {/if}
</div>
