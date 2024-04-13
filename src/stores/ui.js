import { writable } from "svelte/store";

export const tooltipData = writable(null);
export const legendTooltipData = writable(null);
export const selectedColoringScheme = writable("instrument");
