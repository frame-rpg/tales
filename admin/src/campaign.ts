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
    E1gXs41G1mgiM441XXf14ac7ypb2: 'admin',
    UJxxtQzaOzWEFT2vtniCaDQdk2u2: 'read',
    RUEOViYBeHPUBClCUTQCmIhfrlT2: 'read',
  },
  skills: Object.values(skillSeed),
};
