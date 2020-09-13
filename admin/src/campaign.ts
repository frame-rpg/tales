import { Campaign, NewCampaign } from '../../types/campaign';

import { skillSeed } from './skills.js';

export const campaignTemplate: NewCampaign = {
  name: '',
  description: '',
  acl: {},
  skills: [],
  characters: [],
};

export const campaign: Campaign = {
  id: 'c1',
  name: 'Tales of Dinosaurs and Stuff',
  description: 'also Time Travel and Alien Spaceships',
  characters: [
    'ry',
    'connie',
    'momentusUndergrave',
    'chad',
    'thomson',
    'sparks',
    'biscuit',
    'drFanta',
    'smammal',
    'nugget',
  ],
  acl: {
    'eric.eslinger@gmail.com': 'admin',
    'eric.eslinger+tales@gmail.com': 'read',
    'eric.eslinger@manyminds.org': 'read',
    'llahwehttam@gmail.com': 'read',
    'guy@albertelli.com': 'read',
    'megan@albertelli.com': 'read',
    'cljacobs1975@gmail.com': 'read',
    'phil.bowen@gmail.com': 'read',
  },
  skills: Object.values(skillSeed),
};
