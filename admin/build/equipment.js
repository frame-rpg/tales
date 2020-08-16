export const equipment = [
    {
        damage: 2,
        id: 'sword',
        initiative: 4,
        kind: 'melee',
        name: 'Sword',
        size: 1,
        slot: 'hand',
        type: 'weapon',
    },
    {
        accuracy: 1,
        damage: 2,
        id: 'pistol',
        initiative: 4,
        name: 'Basic Pistol',
        range: 0,
        reload: 4,
        size: 1,
        slot: 'hand',
        type: 'weapon',
        kind: 'ranged',
        uses: 4,
    },
    {
        accuracy: 2,
        damage: 4,
        id: 'rifle',
        initiative: 4,
        name: 'Basic Rifle',
        range: 2,
        reload: 2,
        size: 2,
        slot: 'hand',
        type: 'weapon',
        kind: 'ranged',
        uses: 1,
    },
    {
        defense: 1,
        id: 'shield',
        name: 'Shield',
        requirements: [
            {
                power: 'shieldproficiency',
            },
        ],
        size: 1,
        slot: 'hand',
        type: 'armor',
    },
];
