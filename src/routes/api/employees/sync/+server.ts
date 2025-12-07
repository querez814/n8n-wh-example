import { json, type RequestHandler } from '@sveltejs/kit';
import { VITE_MONDAY_API_KEY } from '$env/static/private';
import { pool, initDatabase } from '$lib/db';

export const POST: RequestHandler = async () => {
    try {
        // Initialize database table if not exists
        await initDatabase();

        // Fetch employees from Monday.com
        const query = `query { users { name id email } }`;

        const response = await fetch('https://api.monday.com/v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': VITE_MONDAY_API_KEY || ''
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`Monday API failed: ${response.status}`);
        }

        const data = await response.json();
        const users = data.data?.users || [];

        if (users.length === 0) {
            return json({ success: false, message: 'No users found' }, { status: 404 });
        }

        // Insert or update users in database
        const client = await pool.connect();
        try {
            let inserted = 0;
            let updated = 0;

            for (const user of users) {
                const result = await client.query(
                    `INSERT INTO employees (id, name, email, updated_at) 
                     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                     ON CONFLICT (id) 
                     DO UPDATE SET 
                         name = EXCLUDED.name,
                         email = EXCLUDED.email,
                         updated_at = CURRENT_TIMESTAMP
                     RETURNING (xmax = 0) AS inserted`,
                    [user.id, user.name, user.email]
                );
                
                if (result.rows[0].inserted) {
                    inserted++;
                } else {
                    updated++;
                }
            }

            return json({ 
                success: true, 
                message: `Synced ${users.length} employees`,
                stats: { inserted, updated, total: users.length }
            });

        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Error syncing employees:', error);
        return json({ 
            success: false, 
            message: error instanceof Error ? error.message : 'Failed to sync employees'
        }, { status: 500 });
    }
};
