import { NewCompanion } from '../../../src/types/companion';
import { NewNonplayerCharacter } from '../../../src/types/nonplayer_character';
import { NewPlayerCharacter } from '../../../src/types/player_character';

export const playerTemplate: NewPlayerCharacter = {
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
    movement: -1,
    riding: -1,
    piloting: -1,
    swimming: -1,
    sneaking: -1,
    mightDefense: -1,
    speedDefense: -1,
    convictionDefense: -1,
    focusDefense: -1,
    healthDefense: -1,
    initiative: -1,
    wildernessLore: -1,
    medicine: -1,
    commandAnimal: -1,
    perception: -1,
    mightMeleeAttack: -1,
    speedMeleeAttack: -1,
    focusMeleeAttack: -1,
    convictionMeleeAttack: -1,
    mightRangedAttack: -1,
    speedRangedAttack: -1,
    focusRangedAttack: -1,
    convictionRangedAttack: -1,
    wetScienceKnowledge: -1,
    wetScienceTinker: -1,
    dryScienceKnowledge: -1,
    dryScienceTinker: -1,
    otherKnowledge: -1,
    persuade: -1,
    lie: -1,
    intimidate: -1,
    senseMotive: -1,
    legerdemain: -1,
    hacking: -1,
    pickLocks: -1,
    advancedSecurity: -1,
  },
  status: {},
};

export const companionTemplate: NewCompanion = {
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
  status: {},
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
  acl: {},
  status: {},
};
