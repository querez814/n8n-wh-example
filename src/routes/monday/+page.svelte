<script lang="ts">
    import MondayForm from '$lib/components/MondayForm.svelte';
    
    let successCount = $state(0);
  
    function handleSuccess() {
      successCount++;
    }
</script>

<svelte:head>
  <title>Timesheet Entry</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex flex-col font-['IBM_Plex_Sans'] bg-gradient-to-br from-gray-50 to-gray-100">
  <header class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-6xl mx-auto px-6 py-8">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="font-['Space_Mono'] text-3xl font-bold text-gray-900 mb-2">
            Timesheet Entry
          </h1>
          <p class="font-['IBM_Plex_Sans'] text-gray-600">
            Track your hours and submit to QuickBooks
          </p>
        </div>
        
        {#if successCount > 0}
          <div class="bg-green-50 border-2 border-green-200 rounded-xl px-6 py-4">
            <div class="text-xs font-['IBM_Plex_Sans'] font-semibold text-green-600 uppercase tracking-wide mb-1">
              Submitted Today
            </div>
            <div class="font-['IBM_Plex_Mono'] text-4xl font-bold text-green-700">
              {successCount}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </header>

  <main class="flex-1 py-12 px-6">
    <div class="max-w-6xl mx-auto mb-8">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="font-['IBM_Plex_Sans'] font-semibold text-blue-900 mb-1">
              Automated Processing
            </h3>
            <p class="font-['IBM_Plex_Sans'] text-sm text-blue-800">
              Your timesheet will be automatically synced to QuickBooks and Monday.com via n8n automation.
            </p>
          </div>
        </div>
      </div>
    </div>

    <MondayForm onSuccess={handleSuccess} />
  </main>

  <footer class="bg-white border-t border-gray-200 py-6">
    <p class="max-w-6xl mx-auto px-6 font-['IBM_Plex_Sans'] text-sm text-gray-600 text-center">
      Powered by n8n automation • Data synced to QuickBooks and Monday.com
    </p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>