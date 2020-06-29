import { NewCompanion } from '../../../src/types/companion';
import { NewNonplayerCharacter } from '../../../src/types/nonplayer_character';
import { NewPlayerCharacter } from '../../../src/types/player_character';

export const PLAYER_TEMPLATE: NewPlayerCharacter = {
  name: '',
  acl: {},
  description: '',
  type: 'player',
  attributes: {
    health: {
      edge: 0,
      pool: 5,
    },
    speed: {
      edge: 0,
      pool: 5,
    },
    might: {
      edge: 0,
      pool: 5,
    },
    focus: {
      edge: 0,
      pool: 5,
    },
    conviction: {
      edge: 0,
      pool: 5,
    },
  },
  skills: {
    movement: 0,
    riding: 0,
    piloting: 0,
    swimming: 0,
    sneaking: 0,
    wildernessLore: 0,
    medicine: 0,
    commandAnimal: 0,
    perception: 0,
    wetScienceKnowledge: 0,
    wetScienceTinker: 0,
    dryScienceKnowledge: 0,
    dryScienceTinker: 0,
    persuade: 0,
    lie: 0,
    senseMotive: 0,
    legerdemain: 0,
    hacking: 0,
    pickLocks: 0,
    advancedSecurity: 0,
  },
};

export const COMPANION_TEMPLATE: NewCompanion = {
  name: '',
  description: '',
  acl: {},
  type: 'companion',
  attack: 0,
  defend: 0,
  armor: 0,
  attributes: {
    health: {
      edge: 0,
      pool: 5,
    },
    loyalty: {
      edge: 0,
      pool: 5,
    },
  },
  skills: {},
};

export const NONPLAYER_TEMPLATE: NewNonplayerCharacter = {
  name: '',
  description: '',
  type: 'nonplayer',
  armor: 0,
  attack: 0,
  defend: 0,
  health: 0,
  acl: {},
};
