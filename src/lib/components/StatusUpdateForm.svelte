<script lang="ts">
    import type { ProjectUpdate, WebhookResponse } from '$lib/types';
  
    let { onSuccess }: { onSuccess?: () => void } = $props();
  
    let formData = $state<ProjectUpdate>({
      projectName: '',
      status: 'on-track',
      updateText: '',
      blockers: '',
      nextSteps: ''
    });
  
    let isSubmitting = $state(false);
    let submitMessage = $state('');
    let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
  
    let isValid = $derived(
      formData.projectName.trim() !== '' && 
      formData.updateText.trim() !== ''
    );
  
    async function handleSubmit(e: Event) {
      e.preventDefault();
      
      if (!isValid) return;
  
      isSubmitting = true;
      submitMessage = '';
      submitStatus = 'idle';
  
      try {
        const response = await fetch('/api/webhook', {  
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const result: WebhookResponse = await response.json();
  
        if (result.success) {
          submitStatus = 'success';
          submitMessage = result.message;
          
          formData = {
            projectName: '',
            status: 'on-track',
            updateText: '',
            blockers: '',
            nextSteps: ''
          };
  
          onSuccess?.();
        } else {
          submitStatus = 'error';
          submitMessage = result.message;
        }
      } catch (error) {
        submitStatus = 'error';
        submitMessage = 'Failed to send update. Please try again.';
        console.error('Submit error:', error);
      } finally {
        isSubmitting = false;
      }
    }
</script>

<form class="max-w-[800px] mx-auto" onsubmit={handleSubmit}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="md:col-span-2 flex flex-col gap-2">
      <label for="projectName" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
        PROJECT NAME
      </label>
      <input
        id="projectName"
        type="text"
        bind:value={formData.projectName}
        placeholder="Enter project name..."
        required
        class="font-['IBM_Plex_Mono'] text-base p-3 border-2 border-black bg-white text-black transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
      />
    </div>

    <div class="flex flex-col gap-2">
      <label for="status" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
        STATUS
      </label>
      <select 
        id="status" 
        bind:value={formData.status}
        class="font-['IBM_Plex_Mono'] text-base font-semibold p-3 border-2 border-black bg-white text-black cursor-pointer transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
      >
        <option value="on-track">ON TRACK</option>
        <option value="at-risk">AT RISK</option>
        <option value="blocked">BLOCKED</option>
        <option value="completed">COMPLETED</option>
      </select>
    </div>

    <div class="md:col-span-2 flex flex-col gap-2">
      <label for="updateText" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
        UPDATE
      </label>
      <textarea
        id="updateText"
        bind:value={formData.updateText}
        placeholder="What progress was made this week..."
        rows="4"
        required
        class="font-['IBM_Plex_Sans'] text-base p-3 border-2 border-black bg-white text-black resize-y min-h-[80px] leading-relaxed transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
      ></textarea>
    </div>

    <div class="md:col-span-2 flex flex-col gap-2">
      <label for="blockers" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
        BLOCKERS (Optional)
      </label>
      <textarea
        id="blockers"
        bind:value={formData.blockers}
        placeholder="Any issues or blockers..."
        rows="3"
        class="font-['IBM_Plex_Sans'] text-base p-3 border-2 border-black bg-white text-black resize-y min-h-[80px] leading-relaxed transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
      ></textarea>
    </div>

    <div class="md:col-span-2 flex flex-col gap-2">
      <label for="nextSteps" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
        NEXT STEPS (Optional)
      </label>
      <textarea
        id="nextSteps"
        bind:value={formData.nextSteps}
        placeholder="What's planned for next week..."
        rows="3"
        class="font-['IBM_Plex_Sans'] text-base p-3 border-2 border-black bg-white text-black resize-y min-h-[80px] leading-relaxed transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
      ></textarea>
    </div>
  </div>

  {#if submitMessage}
    <div class="p-4 my-6 font-['Space_Mono'] text-sm font-semibold border-2 {submitStatus === 'success' ? 'bg-[#00ff41] border-black text-black' : 'bg-[#ff4400] border-black text-white'}">
      {submitMessage}
    </div>
  {/if}

  <button 
    type="submit" 
    disabled={!isValid || isSubmitting}
    class="w-full p-5 mt-4 font-['Space_Mono'] text-base font-bold tracking-wider bg-black text-white border-2 border-black cursor-pointer transition-all relative hover:enabled:bg-[#ff4400] hover:enabled:border-[#ff4400] hover:enabled:-translate-x-1 hover:enabled:-translate-y-1 hover:enabled:shadow-[4px_4px_0_#000] active:enabled:translate-x-0 active:enabled:translate-y-0 active:enabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isSubmitting ? 'SENDING...' : 'SEND UPDATE →'}
  </button>
</form>