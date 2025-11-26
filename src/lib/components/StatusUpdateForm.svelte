<script lang="ts">
    import type { ProjectUpdate, WebhookResponse } from '$lib/types';
  
    // Props using Svelte 5 syntax
    let { onSuccess }: { onSuccess?: () => void } = $props();
  
    // Reactive state using $state rune
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
  
    // Derived state for form validation
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
        const response = await fetch('/api/update', {
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
          
          // Reset form after success
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
  
  <form class="status-form" onsubmit={handleSubmit}>
    <div class="form-grid">
      <div class="form-group full-width">
        <label for="projectName">PROJECT NAME</label>
        <input
          id="projectName"
          type="text"
          bind:value={formData.projectName}
          placeholder="Enter project name..."
          required
        />
      </div>
  
      <div class="form-group">
        <label for="status">STATUS</label>
        <select id="status" bind:value={formData.status}>
          <option value="on-track">ON TRACK</option>
          <option value="at-risk">AT RISK</option>
          <option value="blocked">BLOCKED</option>
          <option value="completed">COMPLETED</option>
        </select>
      </div>
  
      <div class="form-group full-width">
        <label for="updateText">UPDATE</label>
        <textarea
          id="updateText"
          bind:value={formData.updateText}
          placeholder="What progress was made this week..."
          rows="4"
          required
        ></textarea>
      </div>
  
      <div class="form-group full-width">
        <label for="blockers">BLOCKERS (Optional)</label>
        <textarea
          id="blockers"
          bind:value={formData.blockers}
          placeholder="Any issues or blockers..."
          rows="3"
        ></textarea>
      </div>
  
      <div class="form-group full-width">
        <label for="nextSteps">NEXT STEPS (Optional)</label>
        <textarea
          id="nextSteps"
          bind:value={formData.nextSteps}
          placeholder="What's planned for next week..."
          rows="3"
        ></textarea>
      </div>
    </div>
  
    {#if submitMessage}
      <div class="message message-{submitStatus}">
        {submitMessage}
      </div>
    {/if}
  
    <button 
      type="submit" 
      class="submit-button"
      disabled={!isValid || isSubmitting}
    >
      {isSubmitting ? 'SENDING...' : 'SEND UPDATE →'}
    </button>
  </form>
  
  <style>
    .status-form {
      max-width: 800px;
      margin: 0 auto;
    }
  
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
  
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  
    .form-group.full-width {
      grid-column: 1 / -1;
    }
  
    label {
      font-family: 'Space Mono', 'Courier New', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #000;
    }
  
    input,
    select,
    textarea {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 1rem;
      padding: 0.75rem;
      border: 2px solid #000;
      background: #fff;
      color: #000;
      transition: all 0.2s;
    }
  
    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: #ff4400;
      box-shadow: 4px 4px 0 #ff4400;
      transform: translate(-2px, -2px);
    }
  
    select {
      cursor: pointer;
      font-weight: 600;
    }
  
    textarea {
      resize: vertical;
      min-height: 80px;
      font-family: 'IBM Plex Sans', sans-serif;
      line-height: 1.5;
    }
  
    .message {
      padding: 1rem;
      margin: 1.5rem 0;
      font-family: 'Space Mono', monospace;
      font-size: 0.875rem;
      font-weight: 600;
      border: 2px solid;
    }
  
    .message-success {
      background: #00ff41;
      border-color: #000;
      color: #000;
    }
  
    .message-error {
      background: #ff4400;
      border-color: #000;
      color: #fff;
    }
  
    .submit-button {
      width: 100%;
      padding: 1.25rem;
      margin-top: 1rem;
      font-family: 'Space Mono', monospace;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      background: #000;
      color: #fff;
      border: 2px solid #000;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
  
    .submit-button:hover:not(:disabled) {
      background: #ff4400;
      border-color: #ff4400;
      transform: translate(-4px, -4px);
      box-shadow: 4px 4px 0 #000;
    }
  
    .submit-button:active:not(:disabled) {
      transform: translate(0, 0);
      box-shadow: none;
    }
  
    .submit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>