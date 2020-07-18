export const equipment = [
  {
    id: 'sword',
    name: 'Sword',
    abilities: [
      {
        type: 'weapon',
        kind: 'melee',
        initiative: 4,
        damage: 2,
      },
    ],
  },
  {
    id: 'pistol',
    name: 'Basic Pistol',
    uses: 4,
    range: 0,
    abilities: [
      {
        type: 'weapon',
        kind: 'ranged',
        initiative: 4,
        damage: 2,
      },
      {
        type: 'action',
        initiatve: 2,
        description: 'Reload the weapon',
        effect: {
          target: 'self',
          attribute: 'uses',
          value: 4,
        },
      },
    ],
  },
  {
    id: 'rifle',
    name: 'Basic Rifle',
    uses: 1,
    range: 2,
    abilities: [
      {
        type: 'weapon',
        kind: 'ranged',
        initiative: 6,
        damage: 4,
      },
      {
        type: 'action',
        initiatve: 2,
        description: 'Reload the weapon',
        effect: {
          target: 'self',
          attribute: 'uses',
          value: 1,
        },
      },
      {
        type: 'action',
        initiatve: 2,
        description: 'Aim',
        effect: {
          target: 'asset',
          duration: 'action',
          skill: [
            'speedrangedattack',
            'mightrangedattack',
            'focusrangedattack',
            'convictionrangedattack',
          ],
        },
      },
    ],
  },
  {
    id: 'shield',
    name: 'Shield',
    requirements: [{ power: 'shieldproficiency' }],
    bonus: {
      mightdefense: { edge: 1, asset: 0 },
      speeddefense: { edge: 1, asset: 0 },
      convictiondefense: { edge: 1, asset: 0 },
      focusdefense: { edge: 1, asset: 0 },
    },
  },
];
