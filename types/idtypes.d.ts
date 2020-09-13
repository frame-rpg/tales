// export interface BasicId {
//   type: 'character' | 'campaign' | 'user';
// }

export interface UserId {
  type: 'user';
  userId: string;
}

export interface CampaignId {
  type: 'campaign';
  campaignId: string;
}

export interface CharacterId {
  type: 'character';
  campaignId: string;
  characterId: string;
}

export type Id = CharacterId | CampaignId | UserId;
