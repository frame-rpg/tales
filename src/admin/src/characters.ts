import { NewCompanion, NewPlayerCharacter } from '../../../src/types/character';

export const PLAYERS: NewPlayerCharacter[] = [
  {
    name: 'Ry McGinnis',
    acl: {
      'cljacobs1975@gmail.com': 'admin',
      'chrissy.jacobs@sfuhs.org': 'admin',
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
      movement: 0,
      riding: -1,
      piloting: 0,
      swimming: -1,
      sneaking: 0,
      mightDefense: 0,
      speedDefense: 0,
      convictionDefense: 0,
      focusDefense: 0,
      healthDefense: 0,
      initiative: 0,
      wildernessLore: -1,
      medicine: -1,
      commandAnimal: 0,
      perception: 0,
      wetScienceKnowledge: -1,
      wetScienceTinker: -1,
      dryScienceKnowledge: 0,
      dryScienceTinker: 0,
      otherKnowledge: -1,
      persuade: 0,
      lie: -1,
      intimidate: -1,
      senseMotive: 0,
      legerdemain: 0,
      hacking: 0,
      pickLocks: 0,
      advancedSecurity: 1,
    },
    status: {
      experience: 27,
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
    name: 'Connecticut (Connie) Butler',
    acl: {
      'malbertelli@gmail.com': 'admin',
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
      movement: -1,
      riding: -1,
      piloting: -1,
      swimming: -1,
      sneaking: 0,
      mightDefense: 0,
      speedDefense: -1,
      convictionDefense: -1,
      focusDefense: -1,
      healthDefense: 0,
      initiative: -1,
      wildernessLore: 0,
      medicine: 0,
      commandAnimal: 1,
      perception: 0,
      wetScienceKnowledge: -2,
      wetScienceTinker: -2,
      otherKnowledge: -2,
      dryScienceKnowledge: -2,
      dryScienceTinker: -2,
      persuade: 0,
      lie: 0,
      intimidate: -1,
      senseMotive: -1,
      legerdemain: 0,
      hacking: -1,
      pickLocks: -1,
      advancedSecurity: -1,
    },
    status: {
      experience: 34,
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
      movement: -1,
      riding: -1,
      piloting: -1,
      swimming: -1,
      sneaking: -1,
      mightDefense: 0,
      speedDefense: -1,
      convictionDefense: -1,
      focusDefense: -1,
      healthDefense: 0,
      initiative: 0,
      wildernessLore: 0,
      medicine: 0,
      commandAnimal: 1,
      perception: 0,
      wetScienceKnowledge: 0,
      wetScienceTinker: 0,
      otherKnowledge: -1,
      dryScienceKnowledge: -1,
      dryScienceTinker: -1,
      persuade: -2,
      lie: -2,
      intimidate: -2,
      senseMotive: -2,
      legerdemain: -1,
      hacking: -1,
      pickLocks: -1,
      advancedSecurity: -1,
    },
    status: {
      experience: 22,
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
    name: 'Chad',
    acl: {
      'albertel@gmail.com': 'admin',
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
      movement: -1,
      riding: -1,
      piloting: -1,
      swimming: -1,
      sneaking: -1,
      mightDefense: 0,
      speedDefense: 1,
      convictionDefense: 0,
      focusDefense: 0,
      healthDefense: 0,
      initiative: 0,
      wildernessLore: -1,
      medicine: 0,
      commandAnimal: -1,
      perception: -1,
      wetScienceKnowledge: -2,
      wetScienceTinker: -2,
      otherKnowledge: -2,
      dryScienceKnowledge: -2,
      dryScienceTinker: -2,
      persuade: -1,
      lie: -1,
      intimidate: -1,
      senseMotive: -1,
      legerdemain: -1,
      hacking: -1,
      pickLocks: -1,
      advancedSecurity: -1,
    },
    status: {
      experience: 18,
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
      movement: 0,
      riding: 0,
      piloting: 0,
      swimming: 0,
      sneaking: 0,
      mightDefense: -1,
      speedDefense: 0,
      convictionDefense: -1,
      focusDefense: -1,
      healthDefense: 0,
      initiative: 0,
      wildernessLore: 0,
      medicine: 0,
      commandAnimal: 0,
      perception: 0,
      wetScienceKnowledge: -1,
      wetScienceTinker: -1,
      otherKnowledge: -1,
      dryScienceKnowledge: -1,
      dryScienceTinker: -1,
      persuade: 0,
      lie: 0,
      intimidate: 0,
      senseMotive: 0,
      legerdemain: -2,
      hacking: -2,
      pickLocks: -2,
      advancedSecurity: -2,
    },
    status: {
      experience: 16,
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

export const COMPANIONS: NewCompanion[] = [
  {
    name: 'Sparks',
    description: 'Ornithomimid',
    acl: {
      'cljacobs1975@gmail.com': 'admin',
      'chrissy.jacobs@sfuhs.org': 'admin',
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
    skills: {},
    status: {},
    abilities: ['hands', 'birdseye'],
  },
  {
    name: 'Biscuit',
    description: 'Ankylosaur',
    acl: {
      'malbertelli@gmail.com': 'admin',
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
    skills: {},
    status: {},
    abilities: [
      'temporalHunter',
      'boneBreaker',
      'sturdyMount',
      'mountedWeapon',
    ],
  },
  {
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
    skills: {},
    status: {},
    abilities: ['terrify', 'sturdyMount', 'mountedWeapon'],
  },
  {
    name: 'Smammal',
    description: 'Small Mammal and Occasional Plot Device',
    acl: {
      'albertel@gmail.com': 'admin',
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
    skills: {},
    status: {},
    abilities: ['hands', 'makingTheGMRegretHisLifeChoices'],
  },
  {
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
    skills: {},
    status: {},
    abilities: [],
  },
];
