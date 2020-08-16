import { Companion, PlayerCharacter } from '../../types/character';

import { playerTemplate } from './characterTemplates.js';

export const players: PlayerCharacter[] = [
  {
    id: 'ry',
    campaign: 'c1',
    name: 'Ry McGinnis',
    acl: {
      'cljacobs1975@gmail.com': 'admin',
      'eric.eslinger@gmail.com': 'admin',
    },
    description: '',
    type: 'player',
    attributes: {
      health: {
        edge: 0,
        pool: 10,
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
        edge: 1,
        pool: 10,
      },
      conviction: {
        edge: 0,
        pool: 7,
      },
    },
    skills: {
      ...playerTemplate.skills,
      advancedsecurity: 1,
      commandanimal: 0,
      convictiondefense: 0,
      dryscienceknowledge: 0,
      drysciencetinker: 0,
      focusdefense: 0,
      hacking: 0,
      healthdefense: 0,
      initiative: 0,
      legerdemain: 0,
      mightdefense: 0,
      movement: 0,
      perception: 0,
      persuade: 0,
      picklocks: 0,
      piloting: 0,
      sensemotive: 0,
      sneaking: 0,
      speeddefense: 0,
    },
    status: {
      experience: 27,
      initiative: 0,
      pools: {
        might: {
          current: 5,
          wound: false,
        },
        speed: {
          current: 5,
          wound: false,
        },
        conviction: {
          current: 7,
          wound: false,
        },
        focus: {
          current: 10,
          wound: false,
        },
        health: {
          current: 10,
          wound: false,
        },
      },
    },
  },
  {
    id: 'connie',
    campaign: 'c1',
    name: 'Connecticut (Connie) Butler',
    acl: {
      'megan@albertelli.com': 'admin',
    },
    description: '',
    type: 'player',
    attributes: {
      health: {
        edge: 0,
        pool: 10,
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
        pool: 7,
      },
      conviction: {
        edge: 2,
        pool: 10,
      },
    },
    skills: {
      ...playerTemplate.skills,
      dryscienceknowledge: -2,
      drysciencetinker: -2,
      healthdefense: 0,
      legerdemain: 0,
      lie: 0,
      medicine: 0,
      mightdefense: 0,
      otherknowledge: -2,
      perception: 0,
      persuade: 0,
      sneaking: 0,
      wetscienceknowledge: -2,
      wetsciencetinker: -2,
      wildernesslore: 0,
    },
    status: {
      experience: 34,
      initiative: 0,
      pools: {
        might: {
          current: 5,
          wound: false,
        },
        speed: {
          current: 5,
          wound: false,
        },
        conviction: {
          current: 10,
          wound: false,
        },
        focus: {
          current: 7,
          wound: false,
        },
        health: {
          current: 10,
          wound: false,
        },
      },
    },
  },
  {
    id: 'momentusUndergrave',
    campaign: 'c1',
    name: 'Momentus Undergrave',
    acl: {
      'llahwehttam@gmail.com': 'admin',
    },
    description: '',
    type: 'player',
    attributes: {
      health: {
        edge: 0,
        pool: 10,
      },
      speed: {
        edge: 0,
        pool: 7,
      },
      might: {
        edge: 0,
        pool: 5,
      },
      focus: {
        edge: 1,
        pool: 10,
      },
      conviction: {
        edge: 0,
        pool: 5,
      },
    },
    skills: {
      ...playerTemplate.skills,
      commandanimal: 1,
      healthdefense: 0,
      initiative: 0,
      intimidate: -2,
      lie: -2,
      medicine: 0,
      mightdefense: 0,
      perception: 0,
      persuade: -2,
      sensemotive: -2,
      wetscienceknowledge: 0,
      wetsciencetinker: 0,
      wildernesslore: 0,
    },
    status: {
      experience: 22,
      initiative: 0,
      pools: {
        might: {
          current: 5,
          wound: false,
        },
        speed: {
          current: 4,
          wound: false,
        },
        conviction: {
          current: 5,
          wound: false,
        },
        focus: {
          current: 10,
          wound: false,
        },
        health: {
          current: 10,
          wound: false,
        },
      },
    },
  },
  {
    id: 'chad',
    campaign: 'c1',
    name: 'Chad',
    acl: {
      'guy@albertelli.com': 'admin',
    },
    description: '',
    type: 'player',
    attributes: {
      health: {
        edge: 0,
        pool: 10,
      },
      speed: {
        edge: 1,
        pool: 6,
      },
      might: {
        edge: 2,
        pool: 10,
      },
      focus: {
        edge: 0,
        pool: 5,
      },
      conviction: {
        edge: 0,
        pool: 7,
      },
    },
    skills: {
      ...playerTemplate.skills,
      convictiondefense: 0,
      dryscienceknowledge: -2,
      drysciencetinker: -2,
      focusdefense: 0,
      healthdefense: 0,
      initiative: 0,
      medicine: 0,
      mightdefense: 0,
      otherknowledge: -2,
      wetscienceknowledge: -2,
      wetsciencetinker: -2,
    },
    status: {
      experience: 18,
      initiative: 0,
      pools: {
        might: {
          current: 10,
          wound: false,
        },
        speed: {
          current: 6,
          wound: false,
        },
        conviction: {
          current: 7,
          wound: false,
        },
        focus: {
          current: 5,
          wound: false,
        },
        health: {
          current: 10,
          wound: false,
        },
      },
    },
  },
  {
    id: 'thomson',
    campaign: 'c1',
    name: 'Thomson Anning',
    acl: {
      'phil.bowen@gmail.com': 'admin',
    },
    description: '',
    type: 'player',
    attributes: {
      health: {
        edge: 0,
        pool: 10,
      },
      speed: {
        edge: 1,
        pool: 10,
      },
      might: {
        edge: 0,
        pool: 5,
      },
      focus: {
        edge: 1,
        pool: 7,
      },
      conviction: {
        edge: 0,
        pool: 5,
      },
    },
    skills: {
      ...playerTemplate.skills,
      movement: 0,
      riding: 0,
      piloting: 0,
      swimming: 0,
      sneaking: 0,
      speeddefense: 0,
      healthdefense: 0,
      initiative: 0,
      wildernesslore: 0,
      medicine: 0,
      commandanimal: 0,
      perception: 0,
      persuade: 0,
      lie: 0,
      intimidate: 0,
      sensemotive: 0,
      legerdemain: -2,
      hacking: -2,
      picklocks: -2,
      advancedsecurity: -2,
    },
    status: {
      experience: 16,
      initiative: 0,
      pools: {
        might: {
          current: 5,
          wound: false,
        },
        speed: {
          current: 10,
          wound: false,
        },
        conviction: {
          current: 5,
          wound: false,
        },
        focus: {
          current: 7,
          wound: false,
        },
        health: {
          current: 10,
          wound: false,
        },
      },
    },
  },
];

export const companions: Companion[] = [
  {
    id: 'sparks',
    campaign: 'c1',
    name: 'Sparks',
    description: 'Ornithomimid',
    acl: {
      'cljacobs1975@gmail.com': 'admin',
    },
    type: 'companion',
    attack: 2,
    defend: 2,
    armor: 0,
    attributes: {
      health: {
        edge: 0,
        pool: 12,
      },
      loyalty: {
        edge: 0,
        pool: 8,
      },
    },
    skills: {
      initiative: 0,
    },
    status: {
      initiative: 0,
      pools: {
        health: {
          current: 1,
          wound: false,
        },
        loyalty: {
          current: 5,
          wound: false,
        },
      },
    },
    abilities: ['hands', 'birdseye'],
  },
  {
    id: 'biscuit',
    campaign: 'c1',
    name: 'Biscuit',
    description: 'Ankylosaur',
    acl: {
      'eric.eslinger@gmail.com': 'admin',
      'megan@albertelli.com': 'admin',
    },
    type: 'companion',
    attack: 2,
    defend: 2,
    armor: 6,
    attributes: {
      health: {
        edge: 0,
        pool: 12,
      },
      loyalty: {
        edge: 0,
        pool: 6,
      },
    },
    skills: {
      initiative: 0,
    },
    status: {
      initiative: 0,
      pools: {
        health: {
          current: 1,
          wound: false,
        },
        loyalty: {
          current: 5,
          wound: false,
        },
      },
    },
    abilities: [
      'temporalHunter',
      'boneBreaker',
      'sturdyMount',
      'mountedWeapon',
    ],
  },
  {
    id: 'drFanta',
    campaign: 'c1',
    name: 'Dr. Fantabulous',
    description: 'Centrosaurus',
    acl: {
      'llahwehttam@gmail.com': 'admin',
    },
    type: 'companion',
    attack: 1,
    defend: 6,
    armor: 10,
    attributes: {
      health: {
        edge: 0,
        pool: 14,
      },
      loyalty: {
        edge: 0,
        pool: 6,
      },
    },
    skills: {
      initiative: 0,
    },
    status: {
      initiative: 0,
      pools: {
        health: {
          current: 1,
          wound: false,
        },
        loyalty: {
          current: 5,
          wound: false,
        },
      },
    },
    abilities: ['terrify', 'sturdyMount', 'mountedWeapon'],
  },
  {
    id: 'smammal',
    campaign: 'c1',
    name: 'Smammal',
    description: 'Small Mammal and Occasional Plot Device',
    acl: {
      'guy@albertelli.com': 'admin',
    },
    type: 'companion',
    attack: 1,
    defend: 3,
    armor: 0,
    attributes: {
      health: {
        edge: 0,
        pool: 8,
      },
      loyalty: {
        edge: 0,
        pool: 4,
      },
    },
    skills: {
      initiative: 0,
    },
    status: {
      initiative: 0,
      pools: {
        health: {
          current: 1,
          wound: false,
        },
        loyalty: {
          current: 5,
          wound: false,
        },
      },
    },
    abilities: ['hands', 'makingTheGMRegretHisLifeChoices'],
  },
  {
    id: 'nugget',
    campaign: 'c1',
    name: 'Nugget 2.0',
    description: 'Raptor',
    acl: {
      'phil.bowen@gmail.com': 'admin',
    },
    type: 'companion',
    attack: 4,
    defend: 1,
    armor: 2,
    attributes: {
      health: {
        edge: 0,
        pool: 15,
      },
      loyalty: {
        edge: 0,
        pool: 5,
      },
    },
    skills: {
      initiative: 0,
    },
    status: {
      initiative: 0,
      pools: {
        health: {
          current: 1,
          wound: false,
        },
        loyalty: {
          current: 5,
          wound: false,
        },
      },
    },
    abilities: [],
  },
];
