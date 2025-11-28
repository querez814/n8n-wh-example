export interface ProjectUpdate {
    projectName: string;
    status: 'on-track' | 'at-risk' | 'blocked' | 'completed';
    updateText: string;
    blockers?: string;
    nextSteps?: string;
  }

export interface MondayUpdate{
  employee: string
  date: string
  hours: string | number
  customer: string
  billable_hours: string | number
  description: string
  service_item: string
  notes: string
  tasks_completed: string[]
}
  
  export interface WebhookResponse {
    success: boolean;
    message: string;
    timestamp?: string;
  }