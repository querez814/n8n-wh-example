<script lang="ts">
    import StatusUpdateForm from '$lib/components/StatusUpdateForm.svelte';
    
    let successCount = $state(0);
  
    function handleSuccess() {
      successCount++;
    }
</script>

<svelte:head>
  <title>Project Status Command</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex flex-col font-['IBM_Plex_Sans'] bg-gray-50 text-black">
  <header class="p-8 bg-black text-white">
    <div class="max-w-[800px] mx-auto flex justify-between items-start">
      <div class="flex-1">
        <h1 class="font-['Space_Mono'] text-4xl md:text-5xl font-bold m-0 tracking-wider leading-none">
          PROJECT STATUS
        </h1>
        <div class="font-['Space_Mono'] text-sm font-normal mt-2 tracking-[0.2em] text-[#00ff41]">
          COMMAND CENTER
        </div>
      </div>
      <div class="flex gap-8">
        <div class="text-right">
          <div class="font-['Space_Mono'] text-[0.625rem] tracking-wider text-gray-500 mb-1">
            UPDATES SENT
          </div>
          <div class="font-['IBM_Plex_Mono'] text-3xl font-semibold text-[#00ff41] leading-none">
            {successCount.toString().padStart(3, '0')}
          </div>
        </div>
      </div>
    </div>
    <div class="h-1 bg-[#ff4400] mt-8 max-w-[800px] mx-auto"></div>
  </header>

  <main class="flex-1 p-8 md:p-12">
    <div class="max-w-[800px] mx-auto mb-8 p-4 md:p-6 bg-[#fffacd] border-2 border-black font-['IBM_Plex_Mono'] text-sm flex items-center gap-4 shadow-[4px_4px_0_#000]">
      <span class="text-2xl leading-none">⚡</span>
      <span>Updates are automatically distributed to Teams, SharePoint, and email via n8n automation pipeline.</span>
    </div>

    <StatusUpdateForm onSuccess={handleSuccess} />
  </main>

  <footer class="p-8 bg-black text-gray-500">
    <div class="h-0.5 bg-gray-800 max-w-[800px] mx-auto mb-4"></div>
    <p class="max-w-[800px] mx-auto m-0 font-['Space_Mono'] text-xs tracking-wider text-center">
      AUTOMATED WORKFLOW SYSTEM // POWERED BY N8N
    </p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>