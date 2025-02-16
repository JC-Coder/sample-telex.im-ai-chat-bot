export interface TelexMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
}

export interface AskQuestionRequest {
  question: string;
  channelId: string;
}

export interface AskQuestionResponse {
  answer: string;
  context?: string;
}

// New Telex webhook types
export interface TelexWebhookPayload {
  channel_id: string;
  settings: TelexSetting[];
  message: string;
}

export interface TelexSetting {
  label: string;
  type: string;
  description: string;
  default: any;
  required: boolean;
}

export interface TelexResponse {
  event_name: string;
  message: string;
  status: string;
  username: string;
}
