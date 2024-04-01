<script>
  import world from "$data/world-110m.json";

  import * as topojson from "topojson-client";
  import { json, csv, autoType, flatGroup } from "d3";
  import { tooltipData } from "../stores/ui.js";

  export let selectedJurisdiction;
  let activeId;

  const handleClick = (place) => {
    selectedJurisdiction = {
      value: place.jurisdiction,
      label: place.jurisdiction,
      ...place,
    };
  };

  let countries = topojson.feature(world, world.objects.countries).features;
  $: console.log($tooltipData);

  const geojsonPath = "src/data/natural_earth.json";
  const boundaries = "src/data/InternationalBoundariesDisputedBoundaries.json";
  const dispArea = "src/data/area.json";

  let worldAreas = [];
  let worldBoundries = [];
  let wbDisputedArea = [];

  json(geojsonPath).then((data) => {
    worldAreas = data.features;
  });
  json(boundaries).then((data) => {
    worldBoundries = data.features;
  });
  json(dispArea).then((data) => {
    wbDisputedArea = data.features;
  });

  // $: console.log(worldAreas);
  // $: console.log(worldBoundries);
  // $: console.log(wbDisputedArea);

  let databasePath = "src/data/database.csv";

  //note that here taxData is asynchronously loaded and initialized with data fetched from a CSV file, exporting it directly won't be possible because the data might not be available immediately when other components try to import it.
  let taxData = [];
  csv(databasePath, autoType).then((data) => {
    taxData = data.map((d) => ({
      ...d,
      taxedType:
        d.instrument == "Excise"
          ? d.targeted == 1
            ? "exciseTargeted"
            : "exciseUntargeted"
          : d.instrument,
      level_2: d.level == "National" ? "National" : "Subnational",
    }));
    console.log(taxData);
  });

  $: taxedPoly = taxData.filter(
    (d) =>
      !d.small_jurisdiction &&
      d.country_code !== "VUT" &&
      d.country_code !== "NCL"
  );

  $: taxedCircle = taxData.filter(
    (d) =>
      d.small_jurisdiction &&
      d.country_code !== "VUT" &&
      d.country_code !== "NCL"
  );
  $: console.log(taxedCircle);

  $: taxedCombined = flatGroup(
    taxData.filter((d) => d.country_code == "VUT" || d.country_code == "NCL"),
    (d) => d.country_code
  ).map(([country, items]) => items);
  // $: console.log(taxedPoly);

  // Function to check if a point is visible in the projected globe
  // Not currently used
  function projectionVisible([lon, lat]) {
    const [x, y] = projection([lon, lat]);
    return (
      x >= 0 && x <= width && y >= 0 && y <= height && lat <= 90 && lat >= -90
    );
  }

  let strokeWidth = 0.5;

  import { geoOrthographic, geoPath, geoCentroid, geoDistance } from "d3-geo";
  import Glow from "./Glow.svelte";

  let width = 400;
  $: height = width; // Because it is a circle, and we want it to update anytime width changes

  $: projection = geoOrthographic()
    .scale(width / 2)
    .rotate([$xRotation, $yRotation, 0])
    .translate([width / 2, height / 2]);

  $: path = geoPath(projection); // This is new!

  // $: console.log(path(borders));

  //this is not used and could be commented out/deleted
  import data from "$data/data.json";

  let radius = 3;

  // Color scale
  import { max } from "d3-array";
  import { scaleLinear } from "d3-scale";

  // Not currently used
  const colorScale = scaleLinear()
    .domain([0, max(data, (d) => d.population)])
    .range(["#26362e", "#0DCC6C"]);

  // // old code to restructure countries so that it will include population info
  // countries.forEach((country) => {
  //   const metadata = data?.find((d) => d.id === country.id);
  //   // console.log(metadata);
  //   if (metadata) {
  //     country.population = metadata.population;
  //     country.country = metadata.country;
  //   }
  // });
  // console.log(countries);

  // Auto rotate the globe, 0.5 degrees per second
  import { timer } from "d3-timer";
  import { spring } from "svelte/motion";

  $: xRotation = spring(0, {
    stiffness: 0.04,
    damping: 0.8,
  });
  $: yRotation = spring(0, {
    stiffness: 0.04,
    damping: 0.7,
  });
  const degreesPerFrame = 0.5;

  const t = timer(() => {
    if (dragging || $tooltipData) return;
    $xRotation += degreesPerFrame;
    // console.log($xRotation);
  }, 0);

  import { onMount } from "svelte";
  import { select } from "d3-selection";
  import { drag } from "d3-drag";

  let globe;
  let dragging = false;
  const DRAG_SENSITIVITY = 0.5;

  onMount(() => {
    const element = select(globe);
    element.call(
      drag()
        .on("drag", (event) => {
          dragging = true;
          $xRotation = $xRotation + event.dx * DRAG_SENSITIVITY;
          $yRotation = $yRotation - event.dy * DRAG_SENSITIVITY;
        })
        .on("end", (event) => {
          dragging = false;
        })
    );
  });

  import Legend from "./Legend.svelte";

  // export let tooltipData;
  let tooltipPath;

  // $: console.log($tooltipData);
  // Whenever tooltipData changes, calculate the center of the country and rotate to it
  $: if ($tooltipData) {
    tooltipPath =
      worldAreas.find(
        (country) =>
          country.properties.WB_A3 === $tooltipData.country_code ||
          country.properties.ADM0_A3 === $tooltipData.country_code
      ) || $tooltipData;
    const center = geoCentroid(tooltipPath);
    $xRotation = -center[0];
    $yRotation = -center[1];
  }
  // $: console.log($xRotation);
  // $: console.log($yRotation);

  import { draw } from "svelte/transition";

  $: rotatingGlobeCenter = [-$xRotation, -$yRotation];
  // $: console.log(rotatingGlobeCenter);

  // Function to calculate fill color
  const colorConditionally = (lon, lat, center, color1, color2) => {
    const circleCoordinate = [lon, lat];
    // console.log(coordinate);
    const gdistance = geoDistance(circleCoordinate, center);
    // console.log($xRotation);

    // Determine fill color based on gdistance
    return gdistance > 1.5 ? color1 : color2;
  };

  export let filters = [];
  let filteredData = [];

  const updateFilteredData = () => {
    if (filters && filters.length > 0) {
      const filtersGrouped = flatGroup(filters, (d) => d.group).map(
        ([group, items]) => ({
          group,
          items,
        })
      );

      const filteredGroupedData = filtersGrouped.map((group) =>
        Array.from(
          new Set(
            merge(
              group.items.map((filter) =>
                data.filter((d) => d[filter.group] == filter.value)
              )
            )
          )
        )
      );
      filteredData =
        filteredGroupedData.length > 0
          ? filteredGroupedData.reduce((a, b) => a.filter((c) => b.includes(c)))
          : [];
    } else {
      filteredData = [];
    }
  };
  $: filters, updateFilteredData();
</script>

<div class="chart-container" bind:clientWidth={width}>
  <h1>SSB taxes around the world</h1>
  <!-- could implement another tooltip to SSB when hover -->
  <h2>Explore which jurisdictions have an SSB tax implemented</h2>
  <svg {width} {height} bind:this={globe} class:dragging>
    <!-- Glow -->
    <Glow />
    <!-- Globe -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- clicking on the non-map area of the globe will set tooltipData as null -->
    <circle
      r={width / 2}
      cx={width / 2}
      cy={height / 2}
      fill="#1c1c1c"
      filter="url('#glow')"
      on:click={() => tooltipData.set(null)}
    />

    <!-- Countries -->
    {#each worldAreas as country}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <path
        d={path(country)}
        fill={colorScale(country.properties.POP_EST || 0)}
        stroke="none"
        on:click={() => {
          const selectedCountry =
            taxedPoly.find((d) => d.country_code == country.properties.WB_A3) ||
            country;
          tooltipData.set(selectedCountry);
          handleClick(selectedCountry);
        }}
        on:focus={() => {
          const selectedCountry =
            taxedPoly.find((d) => d.country_code == country.properties.WB_A3) ||
            country;
          tooltipData.set(selectedCountry);
          handleClick(selectedCountry);
        }}
      />
    {/each}

    <!-- Borders -->
    {#each worldBoundries as boundary}
      <path
        class="boundary {boundary.id}"
        fill="none"
        stroke={boundary.properties.featurecla == "International boundary"
          ? "white"
          : "white"}
        stroke-dasharray={boundary.properties.featurecla ==
        "International boundary"
          ? "null"
          : boundary.properties.TYPE == "Dashed"
            ? "1 0.5"
            : "0.5 0.5"}
        stroke-width={boundary.properties.featurecla == "International boundary"
          ? strokeWidth
          : strokeWidth * 2}
        d={path(boundary)}
      />
    {/each}

    <!-- special color for world bank disputed area - optional for now, as I plan to make only two colors, those with SSB tax and those without. the disputed area could have a in-between color, or could just have a non-ssb tax color
    {#each wbDisputedArea as area}
      {#if area.id > 2}
        <path
          class="disp-area {area.properties.FID}"
          fill="#D2D2D2"
          d={path(area)}
        />
      {:else}
        <path
          class="disp-area {area.properties.FID}"
          fill="#CEACC9"
          d={path(area)}
        />
      {/if}
    {/each} -->

    <!-- plot rotating center -->
    <g>
      <circle
        class="cursor-pointer"
        cx={projection(rotatingGlobeCenter)[0]}
        cy={projection(rotatingGlobeCenter)[1]}
        r="10"
        fill="yellow"
      />
    </g>

    <!-- small countries and non-country jurisdictions -->
    <g>
      {#each taxedCircle as place}
        {#if place.lat && place.lon}
          <circle
            class="cursor-pointer {place.country_code}"
            cx={projection([place.lon, place.lat])[0]}
            cy={projection([place.lon, place.lat])[1]}
            r="3"
            fill={colorConditionally(
              place.lon,
              place.lat,
              rotatingGlobeCenter,
              "none",
              "red"
            )}
            on:click={() => {
              tooltipData.set(place);
              handleClick(place);
            }}
            on:focus={() => {
              tooltipData.set(place);
              handleClick(place);
            }}
          />
        {/if}
      {/each}
    </g>
    <g>
      {#each taxedCombined as places}
        {#each places as place, i}
          {#if i == 0}
            <!-- {console.log(projection([place.lon, place.lat]))} -->
            <path
              class="cursor-pointer"
              transform="translate({projection([
                place.lon,
                place.lat,
              ])[0]}, {projection([place.lon, place.lat])[1]})"
              d="M {radius} {2 * radius} A {radius} {radius} 0 0 1 {radius} 0Z"
              fill={colorConditionally(
                place.lon,
                place.lat,
                rotatingGlobeCenter,
                "none",
                "red"
              )}
              stroke={colorConditionally(
                place.lon,
                place.lat,
                rotatingGlobeCenter,
                "none",
                "white"
              )}
              stroke-width="0.4"
              on:click={() => {
                tooltipData.set(place);
                handleClick(place);
              }}
              on:focus={() => {
                tooltipData.set(place);
                handleClick(place);
              }}
            />
          {:else}
            <path
              class="cursor-pointer"
              transform="translate({projection([
                place.lon,
                place.lat,
              ])[0]}, {projection([place.lon, place.lat])[1]})"
              d="M {radius} 0 A {radius} {radius} 0 0 1 {radius} {2 * radius}Z"
              fill={colorConditionally(
                place.lon,
                place.lat,
                rotatingGlobeCenter,
                "none",
                "red"
              )}
              stroke={colorConditionally(
                place.lon,
                place.lat,
                rotatingGlobeCenter,
                "none",
                "white"
              )}
              stroke-width="0.4"
              on:click={() => {
                tooltipData.set(place);
                handleClick(place);
              }}
              on:focus={() => {
                tooltipData.set(place);
                handleClick(place);
              }}
            />
          {/if}
        {/each}
      {/each}
    </g>

    <!-- Highlight the country -->
    {#if $tooltipData}
      {#key () => $tooltipData.unique_id || $tooltipData.properties.WB_A3}
        <path
          d={path(
            (tooltipPath =
              worldAreas.find(
                (country) =>
                  country.properties.WB_A3 == $tooltipData.country_code
              ) || $tooltipData)
          )}
          fill="transparent"
          stroke="white"
          stroke-width="2"
          pointer-events="none"
          in:draw
        />
      {/key}
    {/if}
  </svg>

  <Legend {colorScale} data={$tooltipData} />
</div>

<style>
  .chart-container {
    max-width: 468px;
    margin: 0 auto;
  }

  body {
    background: rgb(40, 40, 40);
  }

  svg {
    overflow: visible;
  }

  .dragging {
    cursor: grabbing;
  }
  path {
    cursor: pointer;
  }

  /* not recommended in general, but here we already have outline for jurisdictions */
  path:focus {
    outline: none;
  }
  h1,
  h2 {
    color: white;
    text-align: center;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 0.35rem;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 200;
    margin-bottom: 1rem;
  }
</style>
