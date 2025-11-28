import { json, type RequestHandler } from '@sveltejs/kit';
import {VITE_N8N_TEST_WH_URL, VITE_N8N_PROD_WH_URL} from '$env/static/private'
import type { ProjectUpdate, WebhookResponse } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data: ProjectUpdate = await request.json();
    
    // Validate required fields
    if (!data.projectName || !data.status || !data.updateText) {
      return json(
        { success: false, message: 'Missing required fields' } as WebhookResponse,
        { status: 400 }
      );
    }

    const webhookUrl = VITE_N8N_PROD_WH_URL
    
    if (!webhookUrl) {
      return json(
        { success: false, message: 'Webhook URL not configured' } as WebhookResponse,
        { status: 500 }
      );
    }

    // Call n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: 'project-status-app'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook failed: ${response.status} - ${errorText}`);
    }

    return json({
      success: true,
      message: 'Update sent successfully',
      timestamp: new Date().toISOString()
    } as WebhookResponse);

  } catch (error) {
    console.error('Error calling n8n webhook:', error);
    return json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      } as WebhookResponse,
      { status: 500 }
    );
  }
};
