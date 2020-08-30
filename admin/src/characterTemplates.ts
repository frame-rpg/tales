import { NewCompanion } from '../../types/companion';
import { NewNonplayerCharacter } from '../../types/nonplayer_character';
import { NewPlayerCharacter } from '../../types/player_character';

export const playerTemplate: NewPlayerCharacter = {
  name: '',
  acl: {},
  description: '',
  type: 'player',
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

export const companionTemplate: NewCompanion = {
  name: '',
  description: '',
  acl: {},
  type: 'companion',
  attack: 0,
  defend: 0,
  armor: 0,
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
  skills: [],
  abilities: [],
};

export const nonplayerTemplate: NewNonplayerCharacter = {
  name: '',
  description: '',
  type: 'nonplayer',
  armor: 0,
  attack: 0,
  defend: 0,
  health: 0,
  baseInitiative: 0,
  initiative: 0,
  acl: {},
};
