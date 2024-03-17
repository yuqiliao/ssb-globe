<script>
  export let data;

  // $: console.log(data);

  import { format } from "d3-format";
  const suffixFormat = (d) => format(".2~s")(d).replace(/G/, "B");
</script>

{#if data?.jurisdiction}
  <div>
    <h2>{data.jurisdiction}</h2>
    <h3>Population of {suffixFormat(data.population)}</h3>
  </div>
{/if}

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
