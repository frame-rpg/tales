import { SkillDetails, SkillLevels } from '../../types/skill';

export const skillSeed: SkillDetails = {
  advancedsecurity: {
    description: '',
    name: 'Advanced Security',
    attributes: ['focus', 'conviction'],
  },
  commandanimal: {
    description: '',
    name: 'Command Animal',
    attributes: ['conviction', 'focus'],
  },
  convictiondefense: {
    description: '',
    name: 'Conviction Defense',
    attributes: ['conviction'],
  },
  convictionmeleeattack: {
    description: '',
    name: 'Conviction Melee Attack',
    attributes: ['conviction'],
  },
  convictionrangedattack: {
    description: '',
    name: 'Conviction Ranged Attack',
    attributes: ['conviction'],
  },
  dryscienceknowledge: {
    description: '',
    name: 'Dry Science Knowledge',
    attributes: ['conviction', 'focus'],
  },
  drysciencetinker: {
    description: '',
    name: 'Dry Science Tinker',
    attributes: ['conviction', 'focus'],
  },
  focusdefense: {
    description: '',
    name: 'Focus Defense',
    attributes: ['focus'],
  },
  focusmeleeattack: {
    description: '',
    name: 'Focus Melee Attack',
    attributes: ['focus'],
  },
  focusrangedattack: {
    description: '',
    name: 'Focus Ranged Attack',
    attributes: ['focus'],
  },
  hacking: {
    description: '',
    name: 'Hacking',
    attributes: ['conviction', 'focus'],
  },
  healthdefense: {
    description: '',
    name: 'Health Defense',
    attributes: ['health'],
  },
  initiative: {
    description: '',
    name: 'Initiative',
    attributes: ['conviction', 'speed', 'focus', 'might'],
  },
  intimidate: {
    description: '',
    name: 'Intimidate',
    attributes: ['conviction', 'might'],
  },
  legerdemain: {
    description: '',
    name: 'Legerdemain',
    attributes: ['speed'],
  },
  lie: {
    description: '',
    name: 'Lie',
    attributes: ['conviction'],
  },
  medicine: {
    description: '',
    name: 'Medicine',
    attributes: ['conviction', 'focus'],
  },
  mightdefense: {
    description: '',
    name: 'Might Defense',
    attributes: ['might'],
  },
  mightmeleeattack: {
    description: '',
    name: 'Might Melee Attack',
    attributes: ['might'],
  },
  mightrangedattack: {
    description: '',
    name: 'Might Ranged Attack',
    attributes: ['might'],
  },
  movement: {
    description: '',
    name: 'Movement',
    attributes: ['might', 'speed'],
  },
  otherknowledge: {
    description:
      'Any knowledge that does not fall under Wet Science or Dry Science',
    name: 'Knowledge',
    attributes: ['focus', 'conviction'],
  },
  perception: {
    description: '',
    name: 'Perception',
    attributes: ['conviction', 'focus'],
  },
  persuade: {
    description: '',
    name: 'Persuade',
    attributes: ['focus'],
  },
  picklocks: {
    description: '',
    name: 'Pick Locks',
    attributes: ['speed', 'focus', 'conviction'],
  },
  piloting: {
    description: '',
    name: 'Piloting',
    attributes: ['speed', 'conviction', 'focus'],
  },
  riding: {
    description: '',
    name: 'Riding',
    attributes: ['speed', 'conviction'],
  },
  sensemotive: {
    description: '',
    name: 'Sense Motive',
    attributes: ['focus'],
  },
  sneaking: {
    description: '',
    name: 'Sneaking',
    attributes: ['speed', 'focus'],
  },
  speeddefense: {
    description: '',
    name: 'Speed Defense',
    attributes: ['speed'],
  },
  speedmeleeattack: {
    description: '',
    name: 'Speed Melee Attack',
    attributes: ['speed'],
  },
  speedrangedattack: {
    description: '',
    name: 'Speed Ranged Attack',
    attributes: ['speed'],
  },
  swimming: {
    description: '',
    name: 'Swimming',
    attributes: ['might'],
  },
  wetscienceknowledge: {
    description: '',
    name: 'Wet Science Knowledge',
    attributes: ['conviction', 'focus'],
  },
  wetsciencetinker: {
    description: '',
    name: 'Wet Science Tinker',
    attributes: ['conviction', 'focus'],
  },
  wildernesslore: {
    description: '',
    name: 'Wilderness Lore',
    attributes: ['conviction', 'focus'],
  },
};

export const skillLevelSeed: SkillLevels = {
  '-2': 'Inept',
  '-1': 'Unskilled',
  '0': 'Proficient',
  '1': 'Trained',
  '2': 'Expert',
};
