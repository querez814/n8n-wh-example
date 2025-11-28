import {json ,type RequestHandler } from '@sveltejs/kit';
import { VITE_N8N_TEST_MONDAY_FORM } from '$env/static/private';
import type { MondayUpdate, WebhookResponse } from '$lib/types';


export const POST: RequestHandler = async ({request}) => {
    try{
        const data: MondayUpdate = await request.json()

        if (!data.employee || !data.date || !data.customer){
            return json(
                {success: false, message: 'Missing required fields'} as WebhookResponse,
                {status: 400}
            )
        }
        const webhookUrl = VITE_N8N_TEST_MONDAY_FORM

        if (!webhookUrl) {
            return json(
                {success: false, message: 'Webhook url not config'},
                {status: 500}
            )
        }


        const response = await fetch( webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: 'project-status-app'

            })
        })

        if(!response.ok){
            const errorText = await response.text()
            throw new Error(`Webhook failed: ${response.status} - ${errorText}`)
        }


        return json({
            success: true,
            message:'Update sent successfully',
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