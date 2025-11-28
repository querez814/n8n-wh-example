import { json, type RequestHandler } from '@sveltejs/kit';
import { VITE_MONDAY_API_KEY, VITE_MONDAY_BOARD_ID } from '$env/static/private';

export const GET: RequestHandler = async () => {
  try {
    const query = `
     query { users { name id email } } 
    `;

    const response = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': VITE_MONDAY_API_KEY,
        'API-Version': '2025-07'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`Monday API error: ${response.status}`);
    }

    const data = await response.json();
    
    const employees = data.data?.boards?.[0]?.items_page?.items?.map((item: any) => ({
      id: item.id,
      name: item.name
    })) || [];

    return json({ employees });
  } catch (error) {
    console.error('Error fetching employees from Monday.com:', error);
    
    // Return fallback employees on error
    return json({
      employees: [
        { id: '1', name: 'John Smith' },
        { id: '2', name: 'Jane Doe' },
        { id: '3', name: 'Mike Johnson' }
      ]
    });
  }
};