<script>
  export let data;

  // $: console.log(data);

  import { format } from "d3-format";
  const suffixFormat = (d) => format(".2~s")(d).replace(/G/, "B");
</script>

<!-- if the mouse hovers over the map for which there is existing SSB taxes, the ssbtax data json for that country is returned -->
{#if data?.jurisdiction}
  <div>
    <h2>{data.jurisdiction}</h2>
    <h3>Population of {suffixFormat(data.population)}</h3>
  </div>
{/if}

<!-- if the mouse hovers over the map which has no existing SSB taxes, the natural earth json is returned for that country -->
{#if data?.properties}
  <div>
    <h2>{data.properties.BRK_NAME}</h2>
    <h3>Population of {suffixFormat(data.properties.POP_EST)}</h3>
  </div>
{/if}

<style>
  div {
    position: absolute;
    bottom: 30px;
    right: 0;
    text-align: right;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: white;
  }

  h3 {
    font-size: 1.15rem;
    font-weight: 200;
    color: rgba(255, 255, 255, 0.7);
  }
</style>
