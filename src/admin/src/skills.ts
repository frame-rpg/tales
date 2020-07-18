import { SkillDetails, SkillLevels } from '../../../src/types/skill';

export const skillSeed: SkillDetails = {
  advancedsecurity: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Advanced Security',
    preferredAttributes: ['focus', 'conviction'],
  },
  commandanimal: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Command Animal',
    preferredAttributes: ['conviction', 'focus'],
  },
  convictiondefense: {
    description: '',
    name: 'Conviction Defense',
    preferredAttributes: ['conviction'],
  },
  convictionmeleeattack: {
    description: '',
    name: 'Conviction Melee Attack',
    preferredAttributes: ['conviction'],
  },
  convictionrangedattack: {
    description: '',
    name: 'Conviction Ranged Attack',
    preferredAttributes: ['conviction'],
  },
  dryscienceknowledge: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Dry Science Knowledge',
    preferredAttributes: ['conviction', 'focus'],
  },
  drysciencetinker: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Dry Science Tinker',
    preferredAttributes: ['conviction', 'focus'],
  },
  focusdefense: {
    description: '',
    name: 'Focus Defense',
    preferredAttributes: ['focus'],
  },
  focusmeleeattack: {
    description: '',
    name: 'Focus Melee Attack',
    preferredAttributes: ['focus'],
  },
  focusrangedattack: {
    description: '',
    name: 'Focus Ranged Attack',
    preferredAttributes: ['focus'],
  },
  hacking: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Hacking',
    preferredAttributes: ['conviction', 'focus'],
  },
  healthdefense: {
    description: '',
    name: 'Health Defense',
    preferredAttributes: ['health'],
  },
  initiative: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Initiative',
    preferredAttributes: ['conviction', 'speed'],
  },
  intimidate: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Intimidate',
    preferredAttributes: ['conviction', 'might'],
  },
  legerdemain: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Legerdemain',
    preferredAttributes: ['speed'],
  },
  lie: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Lie',
    preferredAttributes: ['conviction'],
  },
  medicine: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Medicine',
    preferredAttributes: ['conviction', 'focus'],
  },
  mightdefense: {
    description: '',
    name: 'Might Defense',
    preferredAttributes: ['might'],
  },
  mightmeleeattack: {
    description: '',
    name: 'Might Melee Attack',
    preferredAttributes: ['might'],
  },
  mightrangedattack: {
    description: '',
    name: 'Might Ranged Attack',
    preferredAttributes: ['might'],
  },
  movement: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Movement',
    preferredAttributes: ['might', 'speed'],
  },
  otherknowledge: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description:
      'Any knowledge that does not fall under Wet Science or Dry Science',
    name: 'Knowledge',
    preferredAttributes: ['focus', 'conviction'],
  },
  perception: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Perception',
    preferredAttributes: ['conviction', 'focus'],
  },
  persuade: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Persuade',
    preferredAttributes: ['focus'],
  },
  picklocks: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Pick Locks',
    preferredAttributes: ['speed', 'focus', 'conviction'],
  },
  piloting: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Piloting',
    preferredAttributes: ['speed', 'conviction', 'focus'],
  },
  riding: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Riding',
    preferredAttributes: ['speed', 'conviction'],
  },
  sensemotive: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Sense Motive',
    preferredAttributes: ['focus'],
  },
  sneaking: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Sneaking',
    preferredAttributes: ['speed', 'focus'],
  },
  speeddefense: {
    description: '',
    name: 'Speed Defense',
    preferredAttributes: ['speed'],
  },
  speedmeleeattack: {
    description: '',
    name: 'Speed Melee Attack',
    preferredAttributes: ['speed'],
  },
  speedrangedattack: {
    description: '',
    name: 'Speed Ranged Attack',
    preferredAttributes: ['speed'],
  },
  swimming: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Swimming',
    preferredAttributes: ['might'],
  },
  wetscienceknowledge: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Wet Science Knowledge',
    preferredAttributes: ['conviction', 'focus'],
  },
  wetsciencetinker: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Wet Science Tinker',
    preferredAttributes: ['conviction', 'focus'],
  },
  wildernesslore: {
    allowedAttributes: ['focus', 'conviction', 'might', 'speed'],
    description: '',
    name: 'Wilderness Lore',
    preferredAttributes: ['conviction', 'focus'],
  },
};

export const skillLevelSeed: SkillLevels = {
  '-2': 'Inept',
  '-1': 'Unskilled',
  '0': 'Proficient',
  '1': 'Trained',
  '2': 'Expert',
};
