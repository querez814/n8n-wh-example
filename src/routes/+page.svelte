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
  
  <div class="container">
    <header class="header">
      <div class="header-content">
        <div class="title-block">
          <h1>PROJECT STATUS</h1>
          <div class="subtitle">COMMAND CENTER</div>
        </div>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-label">UPDATES SENT</div>
            <div class="stat-value">{successCount.toString().padStart(3, '0')}</div>
          </div>
        </div>
      </div>
      <div class="header-line"></div>
    </header>
  
    <main class="main">
      <div class="info-banner">
        <span class="info-icon">⚡</span>
        <span>Updates are automatically distributed to Teams, SharePoint, and email via n8n automation pipeline.</span>
      </div>
  
      <StatusUpdateForm onSuccess={handleSuccess} />
    </main>
  
    <footer class="footer">
      <div class="footer-line"></div>
      <p>AUTOMATED WORKFLOW SYSTEM // POWERED BY N8N</p>
    </footer>
  </div>
  
  <style>
    :global(body) {
      margin: 0;
      padding: 0;
      font-family: 'IBM Plex Sans', sans-serif;
      background: #fafafa;
      color: #000;
    }
  
    .container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  
    .header {
      padding: 2rem;
      background: #000;
      color: #fff;
    }
  
    .header-content {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
  
    .title-block {
      flex: 1;
    }
  
    h1 {
      font-family: 'Space Mono', monospace;
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
      letter-spacing: 0.05em;
      line-height: 1;
    }
  
    .subtitle {
      font-family: 'Space Mono', monospace;
      font-size: 0.875rem;
      font-weight: 400;
      margin-top: 0.5rem;
      letter-spacing: 0.2em;
      color: #00ff41;
    }
  
    .stats {
      display: flex;
      gap: 2rem;
    }
  
    .stat-item {
      text-align: right;
    }
  
    .stat-label {
      font-family: 'Space Mono', monospace;
      font-size: 0.625rem;
      letter-spacing: 0.1em;
      color: #888;
      margin-bottom: 0.25rem;
    }
  
    .stat-value {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 2rem;
      font-weight: 600;
      color: #00ff41;
      line-height: 1;
    }
  
    .header-line {
      height: 4px;
      background: #ff4400;
      margin-top: 2rem;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }
  
    .main {
      flex: 1;
      padding: 3rem 2rem;
    }
  
    .info-banner {
      max-width: 800px;
      margin: 0 auto 2rem;
      padding: 1rem 1.5rem;
      background: #fffacd;
      border: 2px solid #000;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 4px 4px 0 #000;
    }
  
    .info-icon {
      font-size: 1.5rem;
      line-height: 1;
    }
  
    .footer {
      padding: 2rem;
      background: #000;
      color: #888;
    }
  
    .footer-line {
      height: 2px;
      background: #333;
      max-width: 800px;
      margin: 0 auto 1rem;
    }
  
    .footer p {
      max-width: 800px;
      margin: 0 auto;
      font-family: 'Space Mono', monospace;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-align: center;
    }
  
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1.5rem;
      }
  
      .stats {
        width: 100%;
        justify-content: flex-end;
      }
  
      h1 {
        font-size: 2rem;
      }
    }
  </style>