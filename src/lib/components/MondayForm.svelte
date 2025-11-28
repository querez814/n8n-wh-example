<script lang="ts">
    import type { MondayUpdate, WebhookResponse } from '$lib/types';
    import { onMount } from 'svelte';
  
    let { onSuccess }: { onSuccess?: () => void } = $props();
  
    interface Employee {
      id: string;
      name: string;
    }
  
    let employees = $state<Employee[]>([]);
    let loadingEmployees = $state(true);
    
    let formData = $state<MondayUpdate>({
      employee: '',
      date: new Date().toISOString().split('T')[0], // Default to today
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
    let currentStep = $state(1);
  
    // Auto-sync billable hours with total hours by default
    $effect(() => {
      if (formData.hours && !formData.billable_hours) {
        formData.billable_hours = formData.hours;
      }
    });
  
    let isValid = $derived(
      formData.employee.trim() !== '' && 
      formData.date.trim() !== '' &&
      formData.customer.trim() !== '' &&
      formData.hours !== '' &&
      formData.description.trim() !== ''
    );
  
    onMount(async () => {
      try {
        const response = await fetch('/api/employees');
        const data = await response.json();
        employees = data.employees;
      } catch (error) {
        console.error('Failed to load employees:', error);
        // Fallback list
        employees = [
          { id: '1', name: 'John Smith' },
          { id: '2', name: 'Jane Doe' },
          { id: '3', name: 'Mike Johnson' }
        ];
      } finally {
        loadingEmployees = false;
      }
    });
  
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
          
          // Reset form but keep employee and date
          const keepEmployee = formData.employee;
          const keepDate = formData.date;
          
          formData = {
            employee: keepEmployee,
            date: keepDate,
            hours: '',
            customer: '',
            billable_hours: '',
            description: '',
            service_item: '',
            notes: '',
            tasks_completed: []
          };
          
          currentStep = 1;
          onSuccess?.();
          
          // Auto-dismiss success message after 3 seconds
          setTimeout(() => {
            submitMessage = '';
            submitStatus = 'idle';
          }, 3000);
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
  
    function goToStep(step: number) {
      currentStep = step;
    }
  </script>
  
  <form class="max-w-4xl mx-auto" onsubmit={handleSubmit}>
    <!-- Progress Steps -->
    <div class="mb-8 flex items-center justify-center gap-2">
      {#each [1, 2, 3] as step}
        <button
          type="button"
          onclick={() => goToStep(step)}
          class="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all {currentStep === step ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}"
        >
          <span class="font-['Space_Mono'] text-sm font-bold">{step}</span>
          <span class="font-['IBM_Plex_Sans'] text-sm">
            {step === 1 ? 'Basics' : step === 2 ? 'Details' : 'Review'}
          </span>
        </button>
        {#if step < 3}
          <div class="w-8 h-0.5 bg-gray-300"></div>
        {/if}
      {/each}
    </div>
  
    <!-- Step 1: Basics -->
    {#if currentStep === 1}
      <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 class="font-['Space_Mono'] text-2xl font-bold mb-6 text-gray-900">Basic Information</h2>
        
        <div class="space-y-6">
          <!-- Employee Select -->
          <div class="flex flex-col gap-2">
            <label for="employee" class="font-['IBM_Plex_Sans'] text-sm font-semibold text-gray-700">
              Employee *
            </label>
            {#if loadingEmployees}
              <div class="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500 font-['IBM_Plex_Sans'] text-sm">
                Loading employees...
              </div>
            {:else}
              <select
                id="employee"
                bind:value={formData.employee}
                required
                class="font-['IBM_Plex_Sans'] text-base p-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Select an employee...</option>
                {#each employees as emp}
                  <option value={emp.name}>{emp.name}</option>
                {/each}
              </select>
            {/if}
          </div>
  
          <!-- Date and Customer Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label for="date" class="font-['IBM_Plex_Sans'] text-sm font-semibold text-gray-700">
                Date *
              </label>
              <input
                id="date"
                type="date"
                bind:value={formData.date}
                required
                class="font-['IBM_Plex_Sans'] text-base p-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
  
            <div class="flex flex-col gap-2">
              <label for="customer" class="font-['IBM_Plex_Sans'] text-sm font-semibold text-gray-700">
                Customer *
              </label>
              <input
                id="customer"
                type="text"
                bind:value={formData.customer}
                placeholder="e.g., Acme Corp"
                required
                class="font-['IBM_Plex_Sans'] text-base p-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
  
          <!-- Hours Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <label for="hours" class="font-['IBM_Plex_Sans'] text-sm font-semibold text-gray-700">
                Total Hours *
              </label>
              <input
                id="hours"
                type="number"
                step="0.25"
                min="0"
                max="24"
                bind:value={formData.hours}
                placeholder="8.0"
                required
                class="font-['IBM_Plex_Mono'] text-base p-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
  
            <div class="flex flex-col gap-2">
              <label for="billable_hours" class="font-['IBM_Plex_Sans'] text-sm font-semibold text-gray-700">
                Billable Hours
                <span class="text-xs text-gray-500 font-normal">(defaults to total)</span>
              </label>
              <input
                id="billable_hours"
                type="number"
                step="0.25"
                min="0"
                max="24"
                bind:value={formData.billable_hours}
                placeholder="Auto-filled"
                class="font-['IBM_Plex_Mono'] text-base p-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
  
        <div class="mt-8 flex justify-end">
          <button
            type="button"
            onclick={() => goToStep(2)}
            disabled={!formData.employee || !formData.date || !formData.customer || !formData.hours}
            class="px-8 py-3 font-['IBM_Plex_Sans'] text-base font-semibold bg-black text-white rounded-lg transition-all hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next: Details →
          </button>
        </div>
      </div>
    {/if}
  
    <!-- Step 2: Details -->
    {#if currentStep === 2}
      <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 class="font-['Space_Mono'] text-2xl font-bold mb-6 text-gray-900">Work Details</h2>
        
        <div class="space-y-6">
          <!-- Service Item -->
          <div class="flex flex-col gap-2">
            <label for="service_item" class="font-['IBM_Plex_Sans'] text-sm font-semibold text-gray-700">
              Service Item
            </label>
            <input
              id="service_item"
              type="text"
              bind:value={formData.service_item}
              placeholder="e.g., Consulting, Development, Support"
              class="font-['IBM_Plex_Sans'] text-base p-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
  
          <!-- Description -->
          <div class="flex flex-col gap-2">
            <label for="description" class="font-['IBM_Plex_Sans'] text-sm font-semibold text-gray-700">
              Work Description *
            </label>
            <textarea
              id="description"
              bind:value={formData.description}
              placeholder="Describe the work you performed today..."
              rows="5"
              required
              class="font-['IBM_Plex_Sans'] text-base p-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 resize-y leading-relaxed transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            ></textarea>
            <p class="text-xs text-gray-500 font-['IBM_Plex_Sans']">
              Be specific about what was accomplished
            </p>
          </div>
  
          <!-- Tasks Completed -->
          <div class="flex flex-col gap-2">
            <label for="tasks" class="font-['IBM_Plex_Sans'] text-sm font-semibold text-gray-700">
              Tasks Completed
              <span class="text-xs text-gray-500 font-normal">(optional)</span>
            </label>
            <div class="flex gap-2">
              <input
                id="tasks"
                type="text"
                bind:value={taskInput}
                placeholder="Add a task and press Enter..."
                onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
                class="flex-1 font-['IBM_Plex_Sans'] text-base p-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                onclick={addTask}
                class="px-6 py-3 font-['IBM_Plex_Sans'] text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg border-2 border-gray-300 transition-all hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            
            {#if formData.tasks_completed.length > 0}
              <div class="mt-3 space-y-2">
                {#each formData.tasks_completed as task, index}
                  <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <svg class="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="flex-1 font-['IBM_Plex_Sans'] text-sm text-gray-800">{task}</span>
                    <button
                      type="button"
                      onclick={() => removeTask(index)}
                      class="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
  
          <!-- Notes -->
          <div class="flex flex-col gap-2">
            <label for="notes" class="font-['IBM_Plex_Sans'] text-sm font-semibold text-gray-700">
              Additional Notes
              <span class="text-xs text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="notes"
              bind:value={formData.notes}
              placeholder="Any additional context or notes..."
              rows="3"
              class="font-['IBM_Plex_Sans'] text-base p-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 resize-y leading-relaxed transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            ></textarea>
          </div>
        </div>
  
        <div class="mt-8 flex justify-between">
          <button
            type="button"
            onclick={() => goToStep(1)}
            class="px-8 py-3 font-['IBM_Plex_Sans'] text-base font-semibold bg-white text-gray-700 rounded-lg border-2 border-gray-300 transition-all hover:bg-gray-50"
          >
            ← Back
          </button>
          <button
            type="button"
            onclick={() => goToStep(3)}
            disabled={!formData.description}
            class="px-8 py-3 font-['IBM_Plex_Sans'] text-base font-semibold bg-black text-white rounded-lg transition-all hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Review →
          </button>
        </div>
      </div>
    {/if}
  
    <!-- Step 3: Review & Submit -->
    {#if currentStep === 3}
      <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 class="font-['Space_Mono'] text-2xl font-bold mb-6 text-gray-900">Review & Submit</h2>
        
        <div class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs font-['IBM_Plex_Sans'] font-semibold text-gray-500 uppercase tracking-wide mb-1">Employee</p>
              <p class="text-lg font-['IBM_Plex_Sans'] font-semibold text-gray-900">{formData.employee}</p>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs font-['IBM_Plex_Sans'] font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</p>
              <p class="text-lg font-['IBM_Plex_Sans'] font-semibold text-gray-900">{new Date(formData.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs font-['IBM_Plex_Sans'] font-semibold text-gray-500 uppercase tracking-wide mb-1">Customer</p>
              <p class="text-lg font-['IBM_Plex_Sans'] font-semibold text-gray-900">{formData.customer}</p>
            </div>
            
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p class="text-xs font-['IBM_Plex_Sans'] font-semibold text-blue-600 uppercase tracking-wide mb-1">Hours</p>
              <p class="text-lg font-['IBM_Plex_Mono'] font-bold text-blue-900">
                {formData.hours}h total
                {#if formData.billable_hours && formData.billable_hours !== formData.hours}
                  <span class="text-sm text-blue-700">({formData.billable_hours}h billable)</span>
                {/if}
              </p>
            </div>
          </div>
  
          {#if formData.service_item}
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs font-['IBM_Plex_Sans'] font-semibold text-gray-500 uppercase tracking-wide mb-2">Service Item</p>
              <p class="text-base font-['IBM_Plex_Sans'] text-gray-900">{formData.service_item}</p>
            </div>
          {/if}
  
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p class="text-xs font-['IBM_Plex_Sans'] font-semibold text-gray-500 uppercase tracking-wide mb-2">Work Description</p>
            <p class="text-base font-['IBM_Plex_Sans'] text-gray-900 leading-relaxed">{formData.description}</p>
          </div>
  
          {#if formData.tasks_completed.length > 0}
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs font-['IBM_Plex_Sans'] font-semibold text-gray-500 uppercase tracking-wide mb-3">Tasks Completed</p>
              <ul class="space-y-2">
                {#each formData.tasks_completed as task}
                  <li class="flex items-start gap-2 text-base font-['IBM_Plex_Sans'] text-gray-900">
                    <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {task}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
  
          {#if formData.notes}
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-xs font-['IBM_Plex_Sans'] font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</p>
              <p class="text-base font-['IBM_Plex_Sans'] text-gray-900 leading-relaxed">{formData.notes}</p>
            </div>
          {/if}
        </div>
  
        {#if submitMessage}
          <div class="mt-6 p-4 rounded-lg font-['IBM_Plex_Sans'] text-sm font-semibold {submitStatus === 'success' ? 'bg-green-50 text-green-800 border-2 border-green-200' : 'bg-red-50 text-red-800 border-2 border-red-200'}">
            {submitMessage}
          </div>
        {/if}
  
        <div class="mt-8 flex justify-between">
          <button
            type="button"
            onclick={() => goToStep(2)}
            disabled={isSubmitting}
            class="px-8 py-3 font-['IBM_Plex_Sans'] text-base font-semibold bg-white text-gray-700 rounded-lg border-2 border-gray-300 transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            ← Back
          </button>
          <button 
            type="submit" 
            disabled={!isValid || isSubmitting}
            class="px-8 py-3 font-['IBM_Plex_Sans'] text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg transition-all hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Timesheet'}
          </button>
        </div>
      </div>
    {/if}
  </form>