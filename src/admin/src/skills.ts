import { SkillDetails, SkillLevels } from '../../../src/types/skill';

export const skillSeed: SkillDetails = {
  movement: {
    name: 'Movement',
    description: '',
    attributes: ['might', 'speed'],
  },
  riding: {
    name: 'Riding',
    description: '',
    attributes: ['speed', 'conviction'],
  },
  piloting: {
    name: 'Piloting',
    description: '',
    attributes: ['speed', 'conviction', 'focus'],
  },
  swimming: { name: 'Swimming', description: '', attributes: ['might'] },
  sneaking: {
    name: 'Sneaking',
    description: '',
    attributes: ['speed', 'focus'],
  },
  wildernessLore: {
    name: 'Wilderness Lore',
    description: '',
    attributes: ['conviction', 'focus'],
  },
  medicine: {
    name: 'Medicine',
    description: '',
    attributes: ['conviction', 'focus'],
  },
  commandAnimal: {
    name: 'Command Animal',
    description: '',
    attributes: ['conviction', 'focus'],
  },
  perception: {
    name: 'Perception',
    description: '',
    attributes: ['conviction', 'focus'],
  },
  wetScienceKnowledge: {
    name: 'Wet Science Knowledge',
    description: '',
    attributes: ['conviction', 'focus'],
  },
  wetScienceTinker: {
    name: 'Wet Science Tinker',
    description: '',
    attributes: ['conviction', 'focus'],
  },
  dryScienceKnowledge: {
    name: 'Dry Science Knowledge',
    description: '',
    attributes: ['conviction', 'focus'],
  },
  dryScienceTinker: {
    name: 'Dry Science Tinker',
    description: '',
    attributes: ['conviction', 'focus'],
  },
  persuade: { name: 'Persuade', description: '', attributes: ['focus'] },
  lie: { name: 'Lie', description: '', attributes: ['conviction'] },
  senseMotive: {
    name: 'Sense Motive',
    description: '',
    attributes: ['focus'],
  },
  legerdemain: {
    name: 'Legerdemain',
    description: '',
    attributes: ['speed'],
  },
  hacking: {
    name: 'Hacking',
    description: '',
    attributes: ['conviction', 'focus'],
  },
  pickLocks: {
    name: 'Pick Locks',
    description: '',
    attributes: ['speed', 'focus', 'conviction'],
  },
  advancedSecurity: {
    name: 'Advanced Security',
    description: '',
    attributes: ['focus', 'conviction'],
  },
  mightDefense: {
    name: 'Might Defense',
    description: '',
    attributes: ['might'],
  },
  speedDefense: {
    name: 'Speed Defense',
    description: '',
    attributes: ['speed'],
  },
  focusDefense: {
    name: 'Focus Defense',
    description: '',
    attributes: ['focus'],
  },
  convictionDefense: {
    name: 'Conviction Defense',
    description: '',
    attributes: ['conviction'],
  },
  healthDefense: {
    name: 'Health Defense',
    description: '',
    attributes: ['health'],
  },
  otherKnowledge: {
    name: 'Knowledge',
    description:
      'Any knowledge that does not fall under Wet Science or Dry Science',
    attributes: ['focus', 'conviction'],
  },
  initiative: {
    name: 'Initiative',
    description: '',
    attributes: ['conviction', 'speed'],
  },
  intimidate: {
    name: 'Intimidate',
    description: '',
    attributes: ['conviction', 'might'],
  },
};

export const skillLevelSeed: SkillLevels = {
  '-2': 'Inept',
  '-1': 'Unskilled',
  '0': 'Proficient',
  '1': 'Trained',
  '2': 'Expert',
};
