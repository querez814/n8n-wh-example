import { json, type RequestHandler } from '@sveltejs/kit';
import { VITE_MONDAY_API_KEY } from '$env/static/private';

export const GET: RequestHandler = async () => {
    try {
        // Use the same query as the n8n workflow
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
            const errorText = await response.text();
            throw new Error(`Monday API failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        // Map the users from Monday.com API response
        const employees = data.data?.users?.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email
        })) || [];

        return json({ 
            success: true, 
            employees 
        });

    } catch (error) {
        console.error('Error fetching employees from Monday:', error);
        
        // Fallback to hardcoded list if API fails
        return json({ 
            success: false, 
            employees: [
                { id: '1', name: 'John Smith', email: 'john@example.com' },
                { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
                { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
                { id: '4', name: 'Sarah Williams', email: 'sarah@example.com' }
            ],
            message: 'Using fallback employee list - API connection failed'
        });
    }
};