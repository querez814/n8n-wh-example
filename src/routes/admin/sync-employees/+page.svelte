<script lang="ts">
    let syncing = false;
    let result: { success: boolean; message: string; stats?: any } | null = null;

    async function syncEmployees() {
        syncing = true;
        result = null;

        try {
            const response = await fetch('/api/employees/sync', {
                method: 'POST'
            });

            result = await response.json();
        } catch (error) {
            result = {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to sync'
            };
        } finally {
            syncing = false;
        }
    }
</script>

<div class="container">
    <h1>Sync Employees to Database</h1>
    
    <p>Click the button below to fetch all employees from Monday.com and sync them to the PostgreSQL database.</p>

    <button 
        on:click={syncEmployees} 
        disabled={syncing}
        class="sync-button"
    >
        {syncing ? 'Syncing...' : 'Sync Employees from Monday.com'}
    </button>

    {#if result}
        <div class="result {result.success ? 'success' : 'error'}">
            <h3>{result.success ? '✓ Success' : '✗ Error'}</h3>
            <p>{result.message}</p>
            {#if result.stats}
                <ul>
                    <li>Inserted: {result.stats.inserted}</li>
                    <li>Updated: {result.stats.updated}</li>
                    <li>Total: {result.stats.total}</li>
                </ul>
            {/if}
        </div>
    {/if}
</div>

<style>
    .container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
    }

    h1 {
        margin-bottom: 1rem;
    }

    .sync-button {
        background: #0066cc;
        color: white;
        border: none;
        padding: 1rem 2rem;
        font-size: 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1rem;
    }

    .sync-button:hover:not(:disabled) {
        background: #0052a3;
    }

    .sync-button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .result {
        margin-top: 2rem;
        padding: 1rem;
        border-radius: 4px;
    }

    .result.success {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }

    .result.error {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }

    .result ul {
        margin-top: 0.5rem;
        list-style: none;
        padding: 0;
    }
</style>
