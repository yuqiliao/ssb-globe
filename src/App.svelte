<script>
  import Globe from "./components/Globe.svelte";
  // Import any necessary Svelte components or data here
</script>

<div class="container mx-auto flex flex-row justify-center">
  <!-- Left side (rotating globe) -->
  <div class="w-1/2 p-4">
    <!-- Place your rotating globe component here -->
    <div class="border border-gray-300 rounded-md h-96">
      Rotating Globe Component
      <Globe />
    </div>
  </div>

  <!-- Right side (panel) -->
  <div class="w-1/2 p-4">
    <!-- Panel content -->
    <div class="border border-gray-300 rounded-md p-4 h-96">
      <h2 class="text-lg font-semibold mb-4">Jurisdiction Information</h2>
      <!-- Additional information will be displayed here -->
      <!-- You can dynamically show/hide content based on hover or other events -->
      <p>This is the information about the selected jurisdiction.</p>
    </div>
  </div>
</div>

<style>
</style>
