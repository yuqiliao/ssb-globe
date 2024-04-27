<script>
  import { geoOrthographic, geoPath, geoCentroid, geoDistance } from "d3-geo";
  import Glow from "./Glow.svelte";
  import world from "$data/world-110m.json";

  import * as topojson from "topojson-client";
  import { json, csv, autoType, flatGroup, scaleOrdinal } from "d3";
  import {
    tooltipData,
    tooltipData2,
    selectedColoringScheme,
  } from "../stores/ui.js";

  // $: console.log($selectedColoringScheme);
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

  // export let selectedJurisdiction;
  let activeId;

  const handleClick = (place) => {
    $tooltipData = {
      value: place.jurisdiction,
      label: place.jurisdiction,
      ...place,
    };
  };
  const handleMouseout = () => {
    tooltipData2.set(null);
  };
  //   const handleHover = (place) => {
  //     $tooltipData2 = {
  //       value: place.jurisdiction,
  //       label: place.jurisdiction,
  //       ...place,
  //     };
  //   };
  //   const handleHover = (place) => {
  //     return function handleMousemoveFn(e) {
  //         const selectedCountryWithMousePos = {
  //             ...place,
  //             mouseX: e.clientX,
  //             mouseY: e.clientY
  //         };
  //         // Update tooltipData with the selected country including mouse position
  //         tooltipData.set(selectedCountryWithMousePos);
  //     };
  // };

  let countries = topojson.feature(world, world.objects.countries).features;
  // $: console.log("tooltipData", $tooltipData);

  const geojsonPath = "src/static/data/natural_earth.json";
  const boundaries =
    "src/static/data/InternationalBoundariesDisputedBoundaries.json";
  const dispArea = "src/static/data/area.json";

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

  let databasePath = "src/static/data/database.csv";

  //note that here taxData is asynchronously loaded and initialized with data fetched from a CSV file, exporting it directly won't be possible because the data might not be available immediately when other components try to import it.
  // YL: added `|| d.level == "National "` because Russia's level column has an extra space
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
      level_2:
        d.level == "National" || d.level == "National "
          ? "National"
          : "Subnational",
    }));
    // console.log(taxData);
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
  // $: console.log(taxedCircle);

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

  let width = 400;
  $: height = width; // Because it is a circle, and we want it to update anytime width changes

  $: projection = geoOrthographic()
    .scale(width / 2)
    .rotate([$xRotation, $yRotation, 0])
    .translate([width / 2, height / 2]);

  $: path = geoPath(projection); // This is new!

  // $: console.log(path(borders));

  let radius = 3;

  // Color scale
  import { max } from "d3-array";
  import { scaleLinear } from "d3-scale";

  // Function to color jurisdicitons
  // Define color scales based on different coloring schemes
  const instrumentColorScale = scaleOrdinal()
    .domain(instrumentGroups.map((d) => d.value))
    .range(instrumentColors);

  const regionColorScale = scaleOrdinal()
    .domain(regionGroups.map((d) => d.value))
    .range(regionColors);

  const incomeColorScale = scaleOrdinal()
    .domain(incomeGroups.map((d) => d.value))
    .range(incomeColors);

  const levelColorScale = scaleOrdinal()
    .domain(levelGroups.map((d) => d.value))
    .range(levelColors);

  // Function to determine which color scale and selected country property to use
  const getColorScaleAndProperty = (
    selectedColoringScheme,
    selectedCountry
  ) => {
    let colorScale, selectedProperty;

    // Choose color scale and selected property based on selectedColoringScheme
    if (selectedColoringScheme === "instrument") {
      colorScale = instrumentColorScale;
      selectedProperty = selectedCountry.taxedType;
    } else if (selectedColoringScheme === "region") {
      colorScale = regionColorScale;
      selectedProperty = selectedCountry.region;
    } else if (selectedColoringScheme === "income") {
      colorScale = incomeColorScale;
      selectedProperty = selectedCountry.income_group;
    } else if (selectedColoringScheme === "level") {
      colorScale = levelColorScale;
      selectedProperty = selectedCountry.level_2;
    } // Add more conditions for other coloring schemes if needed

    return { colorScale, selectedProperty };
  };

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="chart-container" bind:clientWidth={width}>
  <div class="px-4 pb-4">
    <h1
      class="my-2 text-xl sm:text-[2rem] font-bold text-center text-gray-900 transition duration-1000 loop-animation"
    >
      SSB tax around the world
    </h1>
    <!-- could implement another tooltip to SSB when hover -->
    <h2 class="my-2 text-sm sm:text-base font-normal text-justify">
      Explore the jurisdictions which has implmented sugar-sweetened beverage
      (SSB) tax, based on the <a
        class="underline"
        href="https://ssbtax.worldbank.org/"
        target="”_blank”">Global SSB Tax Database</a
      > from the World Bank.
    </h2>
  </div>
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
      fill="#f9fafb"
      filter="url('#glow')"
      on:click={() => tooltipData.set(null)}
    />

    <!-- Countries -->
    {#each worldAreas as country}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- base gray map for all jurisdictions  -->
      <path fill="#d1d5db" stroke="none" d={path(country)} />
      <!-- color the jurisdictions with ssb taxes -->
      {#if taxedPoly.find((d) => d.country_code == country.properties.WB_A3)}
        <path
          d={path(country)}
          fill={(() => {
            const selectedCountry =
              taxedPoly.find(
                (d) => d.country_code == country.properties.WB_A3
              ) || country;

            // Get color scale and selected property based on selectedColoringScheme
            const { colorScale, selectedProperty } = getColorScaleAndProperty(
              $selectedColoringScheme,
              selectedCountry
            );

            return colorScale(selectedProperty);
          })()}
          stroke="none"
          on:mouseover={(event) => {
            const selectedCountry =
              taxedPoly.find(
                (d) => d.country_code == country.properties.WB_A3
              ) || country;
            // console.log("selectedCountry:", selectedCountry);
            // Define handleMousemoveFn directly YL: I tried to define this function in the script section but for some reason it's not working, so have to create a function on the fly here, which makes the code very ulgy
            const handleMousemoveFn = (e) => {
              const selectedCountryWithMousePos = {
                ...selectedCountry,
                mouseX: e.clientX,
                mouseY: e.clientY,
              };
              // Update tooltipData with the selected country including mouse position
              // console.log("this is working yay!");
              tooltipData2.set(selectedCountryWithMousePos);
              // console.log($tooltipData2);
            };
            // Invoke handleMousemoveFn with the mouse event
            handleMousemoveFn(event);
          }}
          on:mouseout={handleMouseout}
          on:click={() => {
            const selectedCountry =
              taxedPoly.find(
                (d) => d.country_code == country.properties.WB_A3
              ) || country;
            // console.log("selectedCountry:", selectedCountry);
            tooltipData.set(selectedCountry);
            handleClick(selectedCountry);
          }}
          on:focus={() => {
            const selectedCountry =
              taxedPoly.find(
                (d) => d.country_code == country.properties.WB_A3
              ) || country;
            tooltipData.set(selectedCountry);
            handleClick(selectedCountry);
          }}
        />
      {/if}
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

    <!-- special color for world bank disputed area -->
    {#each wbDisputedArea as area}
      <!-- for non-China-India disputed areas, make the color gray -->
      {#if area.id > 2}
        <path
          class="disp-area {area.properties.FID}"
          fill="#D2D2D2"
          d={path(area)}
        />
        <!-- for China-India disputed areas (need to do a in-between color); ideally, need to do a in-between color. but I decided to keep it simple as gray for now, as it's not the focus of the globe and I don't want these areas to stand out with different colors -->
      {:else}
        <path
          class="disp-area {area.properties.FID}"
          fill="#D2D2D2"
          d={path(area)}
        />
      {/if}
    {/each}

    <!-- plot rotating center , for dev/testing-->
    <!-- <g>
      <circle
        class="cursor-pointer"
        cx={projection(rotatingGlobeCenter)[0]}
        cy={projection(rotatingGlobeCenter)[1]}
        r="10"
        fill="yellow"
      />
    </g> -->

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
              (() => {
                // Get color scale and selected property based on selectedColoringScheme
                const { colorScale, selectedProperty } =
                  getColorScaleAndProperty($selectedColoringScheme, place);

                return colorScale(selectedProperty);
              })()
            )}
            on:click={() => {
              tooltipData.set(place);
              handleClick(place);
            }}
            on:focus={() => {
              tooltipData.set(place);
              handleClick(place);
            }}
            on:mouseover={(event) => {
              const selectedCountry = place;
              const handleMousemoveFn = (e) => {
                const selectedCountryWithMousePos = {
                  ...selectedCountry,
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                };
                tooltipData2.set(selectedCountryWithMousePos);
                // console.log($tooltipData2);
              };
              // Invoke handleMousemoveFn with the mouse event
              handleMousemoveFn(event);
            }}
            on:mouseout={handleMouseout}
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
                (() => {
                  // Get color scale and selected property based on selectedColoringScheme
                  const { colorScale, selectedProperty } =
                    getColorScaleAndProperty($selectedColoringScheme, place);

                  return colorScale(selectedProperty);
                })()
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
                (() => {
                  // Get color scale and selected property based on selectedColoringScheme
                  const { colorScale, selectedProperty } =
                    getColorScaleAndProperty($selectedColoringScheme, place);

                  return colorScale(selectedProperty);
                })()
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
      {#if taxedPoly.find((d) => d.country_code == $tooltipData.country_code) || $tooltipData.country_code == "VUT" || $tooltipData.country_code == "NCL"}
        {#key () => $tooltipData.unique_id || $tooltipData.properties.WB_A3 || $tooltipData.properties.ADM0_A3}
          <!-- if $tooltipData is part of the taxedPoly Or part of the parcial circle - draw the boarder of the jurisidction -->
          <path
            d={path(
              (tooltipPath =
                worldAreas.find(
                  (country) =>
                    country.properties.WB_A3 == $tooltipData.country_code
                ) || $tooltipData)
            )}
            fill="transparent"
            stroke="#fafafa"
            stroke-width="2"
            pointer-events="none"
            in:draw
          />
        {/key}
      {:else if taxedCircle.find((d) => d.country_code == $tooltipData.country_code)}
        {#key () => $tooltipData.unique_id || $tooltipData.properties.WB_A3 || $tooltipData.properties.ADM0_A3}
          <!-- if $tooltipData is part of the taxCircle - draw the boarder of the circles -->
          <circle
            class="cursor-pointer {$tooltipData.country_code}"
            cx={projection([$tooltipData.lon, $tooltipData.lat])[0]}
            cy={projection([$tooltipData.lon, $tooltipData.lat])[1]}
            r="3"
            fill="transparent"
            stroke="#fafafa"
            stroke-width="2"
            pointer-events="none"
            in:draw
          />
        {/key}
      {/if}
    {/if}

    <!-- Highlight the country when hover -->
    <!-- {#if $tooltipData2}
      {#key () => $tooltipData2.unique_id || $tooltipData2.properties.WB_A3 || $tooltipData2.properties.ADM0_A3}
        <path
          d={path(
            (tooltipPath =
              worldAreas.find(
                (country) =>
                  country.properties.WB_A3 == $tooltipData2.country_code
              ) || $tooltipData2)
          )}
          fill="transparent"
          stroke="white"
          stroke-width="2"
          pointer-events="none"
          in:draw
        />
      {/key}
    {/if} -->
  </svg>
</div>

<style>
  .chart-container {
    max-width: 486px;
    margin: 0 auto;
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

  @keyframes colorChange {
    0% {
      color: #0b73ae;
    } /* Starting color */
    25% {
      color: #87cadd;
    } /* Midway color */
    50% {
      color: #7fc07e;
    } /* Ending color */

    75% {
      color: #fbb158;
    } /* Starting color */
    100% {
      color: #c87db6;
    } /* Midway color */
  }

  .loop-animation {
    animation: colorChange 15s infinite; /* Adjust duration and timing as needed */
  }
</style>
