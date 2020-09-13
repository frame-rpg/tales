export interface BasicId {
  type: 'character' | 'campaign' | 'user';
}

export interface UserId extends BasicId {
  type: 'user';
  userId: string;
}

export interface CampaignId extends BasicId {
  type: 'campaign';
  campaignId: string;
}

export interface CharacterId extends BasicId {
  type: 'character';
  campaignId: string;
  characterId: string;
}

export type Id = CharacterId | CampaignId | UserId;
