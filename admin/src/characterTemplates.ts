import { Companion } from '../../types/companion';
import { NonplayerCharacter } from '../../types/nonplayer_character';
import { PlayerCharacter } from '../../types/player_character';

export const playerTemplate: Omit<
  PlayerCharacter,
  'characterId' | 'campaignId'
> = {
  name: '',
  acl: {},
  description: '',
  type: 'character',
  subtype: 'player',
  initiative: 0,
  experience: 0,
  skills: [],
  attributes: {
    health: {
      name: 'health',
      edge: 0,
      pool: 5,
      wound: false,
      current: 5,
    },
    speed: {
      name: 'speed',
      wound: false,
      current: 5,
      edge: 0,
      pool: 5,
    },
    might: {
      name: 'might',
      wound: false,
      current: 5,
      edge: 0,
      pool: 5,
    },
    focus: {
      name: 'focus',
      wound: false,
      current: 5,
      edge: 0,
      pool: 5,
    },
    conviction: {
      name: 'conviction',
      wound: false,
      current: 5,
      edge: 0,
      pool: 5,
    },
  },
};

export const companionTemplate: Omit<
  Companion,
  'characterId' | 'campaignId'
> = {
  name: '',
  description: '',
  acl: {},
  attack: 0,
  defend: 0,
  armor: 0,
  type: 'character',
  subtype: 'companion',
  baseInitiative: 0,
  initiative: 0,
  attributes: {
    health: {
      name: 'health',
      edge: 0,
      pool: 5,
      wound: false,
      current: 5,
    },
    loyalty: {
      name: 'loyalty',
      edge: 0,
      pool: 5,
      wound: false,
      current: 5,
    },
  },
  skills: [
    {
      skillId: 'attack',
      name: 'Attack',
      description: 'Companion Attack Skill',
      attributes: ['loyalty'],
      type: 'attack',
      category: 'melee',
      level: 'proficient',
    },
    {
      skillId: 'defense',
      name: 'Defense',
      description: 'Companion Defense Skill',
      attributes: ['loyalty'],
      type: 'defense',
      category: 'defense',
      level: 'proficient',
    },
    {
      skillId: 'health',
      name: 'Health',
      description: 'Companion Health Check',
      attributes: ['health'],
      category: 'defense',
      type: 'health',
      level: 'proficient',
    },
  ],
  abilities: [],
};

export const nonplayerTemplate: Omit<
  NonplayerCharacter,
  'characterId' | 'campaignId'
> = {
  name: '',
  description: '',
  type: 'character',
  subtype: 'nonplayer',
  armor: 0,
  attack: 0,
  defend: 0,
  health: 0,
  baseInitiative: 0,
  initiative: 0,
  acl: {},
};
