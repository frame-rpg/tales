export interface Task {
  type: string;
  userId: string;
  status: 'new' | 'processing' | 'error' | 'processed';
}

export interface CreateCampaign extends Task {
  type: 'createCampaign';
}

export interface CreateCharacter extends Task {
  type: 'createCampaign';
}
