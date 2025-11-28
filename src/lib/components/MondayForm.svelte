<script lang="ts">
    import type { MondayUpdate, WebhookResponse } from '$lib/types';
  
    let { onSuccess }: { onSuccess?: () => void } = $props();
  
    let formData = $state<MondayUpdate>({
      employee: '',
      date: '',
      hours: '',
      customer: '',
      billable_hours: '',
      description: '',
      service_item: '',
      notes: '',
      tasks_completed: []
    });
  
    let taskInput = $state('');
    let isSubmitting = $state(false);
    let submitMessage = $state('');
    let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
  
    let isValid = $derived(
      formData.employee.trim() !== '' && 
      formData.date.trim() !== '' &&
      formData.customer.trim() !== ''
    );
  
    function addTask() {
      if (taskInput.trim() !== '') {
        formData.tasks_completed = [...formData.tasks_completed, taskInput.trim()];
        taskInput = '';
      }
    }
  
    function removeTask(index: number) {
      formData.tasks_completed = formData.tasks_completed.filter((_, i) => i !== index);
    }
  
    async function handleSubmit(e: Event) {
      e.preventDefault();
      
      if (!isValid) return;
  
      isSubmitting = true;
      submitMessage = '';
      submitStatus = 'idle';
  
      try {
        const response = await fetch('/monday', {
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
            employee: '',
            date: '',
            hours: '',
            customer: '',
            billable_hours: '',
            description: '',
            service_item: '',
            notes: '',
            tasks_completed: []
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
      <!-- Employee Name -->
      <div class="flex flex-col gap-2">
        <label for="employee" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
          EMPLOYEE NAME
        </label>
        <input
          id="employee"
          type="text"
          bind:value={formData.employee}
          placeholder="Enter employee name..."
          required
          class="font-['IBM_Plex_Mono'] text-base p-3 border-2 border-black bg-white text-black transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
        />
      </div>
  
      <!-- Date -->
      <div class="flex flex-col gap-2">
        <label for="date" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
          DATE
        </label>
        <input
          id="date"
          type="date"
          bind:value={formData.date}
          required
          class="font-['IBM_Plex_Mono'] text-base p-3 border-2 border-black bg-white text-black transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
        />
      </div>
  
      <!-- Customer -->
      <div class="md:col-span-2 flex flex-col gap-2">
        <label for="customer" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
          CUSTOMER
        </label>
        <input
          id="customer"
          type="text"
          bind:value={formData.customer}
          placeholder="Enter customer name..."
          required
          class="font-['IBM_Plex_Mono'] text-base p-3 border-2 border-black bg-white text-black transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
        />
      </div>
  
      <!-- Hours -->
      <div class="flex flex-col gap-2">
        <label for="hours" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
          TOTAL HOURS
        </label>
        <input
          id="hours"
          type="number"
          step="0.5"
          bind:value={formData.hours}
          placeholder="0.0"
          class="font-['IBM_Plex_Mono'] text-base p-3 border-2 border-black bg-white text-black transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
        />
      </div>
  
      <!-- Billable Hours -->
      <div class="flex flex-col gap-2">
        <label for="billable_hours" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
          BILLABLE HOURS
        </label>
        <input
          id="billable_hours"
          type="number"
          step="0.5"
          bind:value={formData.billable_hours}
          placeholder="0.0"
          class="font-['IBM_Plex_Mono'] text-base p-3 border-2 border-black bg-white text-black transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
        />
      </div>
  
      <!-- Service Item -->
      <div class="md:col-span-2 flex flex-col gap-2">
        <label for="service_item" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
          SERVICE ITEM
        </label>
        <input
          id="service_item"
          type="text"
          bind:value={formData.service_item}
          placeholder="Enter service item..."
          class="font-['IBM_Plex_Mono'] text-base p-3 border-2 border-black bg-white text-black transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
        />
      </div>
  
      <!-- Description -->
      <div class="md:col-span-2 flex flex-col gap-2">
        <label for="description" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
          DESCRIPTION
        </label>
        <textarea
          id="description"
          bind:value={formData.description}
          placeholder="Describe the work performed..."
          rows="4"
          class="font-['IBM_Plex_Sans'] text-base p-3 border-2 border-black bg-white text-black resize-y min-h-[80px] leading-relaxed transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
        ></textarea>
      </div>
  
      <!-- Tasks Completed -->
      <div class="md:col-span-2 flex flex-col gap-2">
        <label for="tasks" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
          TASKS COMPLETED
        </label>
        <div class="flex gap-2">
          <input
            id="tasks"
            type="text"
            bind:value={taskInput}
            placeholder="Add a task..."
            onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
            class="flex-1 font-['IBM_Plex_Mono'] text-base p-3 border-2 border-black bg-white text-black transition-all focus:outline-none focus:border-[#ff4400] focus:shadow-[4px_4px_0_#ff4400] focus:-translate-x-0.5 focus:-translate-y-0.5"
          />
          <button
            type="button"
            onclick={addTask}
            class="px-6 font-['Space_Mono'] text-sm font-bold tracking-wider bg-black text-white border-2 border-black transition-all hover:bg-[#ff4400] hover:border-[#ff4400] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            ADD
          </button>
        </div>
        
        {#if formData.tasks_completed.length > 0}
          <div class="mt-2 space-y-2">
            {#each formData.tasks_completed as task, index}
              <div class="flex items-center gap-2 p-2 bg-gray-100 border-2 border-black">
                <span class="flex-1 font-['IBM_Plex_Sans'] text-sm">• {task}</span>
                <button
                  type="button"
                  onclick={() => removeTask(index)}
                  class="px-3 py-1 font-['Space_Mono'] text-xs font-bold bg-[#ff4400] text-white border-2 border-black transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#000]"
                >
                  ✕
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
  
      <!-- Notes -->
      <div class="md:col-span-2 flex flex-col gap-2">
        <label for="notes" class="font-['Space_Mono'] text-xs font-bold tracking-wider text-black">
          NOTES (Optional)
        </label>
        <textarea
          id="notes"
          bind:value={formData.notes}
          placeholder="Additional notes..."
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
      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT TIMESHEET →'}
    </button>
  </form>