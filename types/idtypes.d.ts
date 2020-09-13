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

export interface OwnedCharacterId extends BasicId {
  type: 'character';
  userId: string;
  characterId: string;
  parent: 'user';
}

export interface CharacterCampaignId extends BasicId {
  type: 'character';
  campaignId: string;
  characterId: string;
  parent: 'campaign';
}

export type CharacterId = OwnedCharacterId | CharacterCampaignId;

export type Id = OwnedCharacterId | CharacterCampaignId | CampaignId | UserId;
