import { Campaign } from '../../types/campaign';
import { dinoSkillSeed } from './skills.js';

export const campaign: Omit<Campaign, 'campaignId'>[] = [
  {
    type: 'campaign',
    name: 'Tales of Dinosaurs and Stuff',
    description: 'also Time Travel and Alien Spaceships',
    acl: {
      E1gXs41G1mgiM441XXf14ac7ypb2: 'admin',
      UJxxtQzaOzWEFT2vtniCaDQdk2u2: 'read',
      RUEOViYBeHPUBClCUTQCmIhfrlT2: 'read',
    },
    skills: Object.values(dinoSkillSeed),
  },
  {
    type: 'campaign',
    name: 'Tales of Fantasy and Fighting',
    description: 'also Underground Caverns and Chaos',
    acl: {
      E1gXs41G1mgiM441XXf14ac7ypb2: 'admin',
      UJxxtQzaOzWEFT2vtniCaDQdk2u2: 'read',
      RUEOViYBeHPUBClCUTQCmIhfrlT2: 'read',
    },
    skills: Object.values(dinoSkillSeed),
  },
];
