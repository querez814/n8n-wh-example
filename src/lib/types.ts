export interface ProjectUpdate {
    projectName: string;
    status: 'on-track' | 'at-risk' | 'blocked' | 'completed';
    updateText: string;
    blockers?: string;
    nextSteps?: string;
  }
  
  export interface WebhookResponse {
    success: boolean;
    message: string;
    timestamp?: string;
  }