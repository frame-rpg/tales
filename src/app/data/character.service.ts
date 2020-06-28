import { Character, NewCharacter } from '../types/character';
import {
  NewPlayerCharacter,
  SkillDescription,
  SkillNames,
} from '../types/player_character';
import { map, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { NewCharacterBase } from '../types/character_base';
import { NewCompanion } from '../types/companion';
import { NewNonplayerCharacter } from '../types/nonplayer_character';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  list() {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.firestore
          .collection<Character>('characters', (ref) =>
            ref.where(`acl.${user.uid}`, 'in', ['read', 'write', 'admin'])
          )
          .valueChanges({ idField: 'id' })
      )
    );
  }

  get(id: String) {
    return this.firestore
      .doc<Character>(`/characters/${id}`)
      .snapshotChanges()
      .pipe(
        map((v) => ({ id: v.payload.id, ...v.payload.data() } as Character))
      );
  }

  update(character: Partial<Character> & { id: string }) {
    return this.firestore.doc(`/characters/${character.id}`).update(character);
  }

  async create(character: NewCharacter) {
    const user = await this.auth.currentUser;
    const toAdd = { ...character };
    toAdd.acl[user.uid] = 'admin';
    return this.firestore.collection('/characters').add(character);
  }
}

export const NONPLAYER_TEMPLATE: NewNonplayerCharacter = {
  name: '',
  description: '',
  type: 'nonplayer',
  armor: 0,
  attack: 0,
  defend: 0,
  health: 0,
  acl: {},
};

export const PLAYER_TEMPLATE: NewPlayerCharacter = {
  name: '',
  acl: {},
  description: '',
  type: 'player',
  health: {
    edge: 0,
    maxPool: 5,
    currentPool: 5,
    wound: false,
  },
  speed: {
    edge: 0,
    maxPool: 5,
    currentPool: 5,
    wound: false,
  },
  might: {
    edge: 0,
    maxPool: 5,
    currentPool: 5,
    wound: false,
  },
  focus: {
    edge: 0,
    maxPool: 5,
    currentPool: 5,
    wound: false,
  },
  conviction: {
    edge: 0,
    maxPool: 5,
    currentPool: 5,
    wound: false,
  },
  skills: {
    movement: 0,
    riding: 0,
    piloting: 0,
    swimming: 0,
    sneaking: 0,
    wildernessLore: 0,
    medicine: 0,
    commandAnimal: 0,
    perception: 0,
    wetScienceKnowledge: 0,
    wetScienceTinker: 0,
    dryScienceKnowledge: 0,
    dryScienceTinker: 0,
    persuade: 0,
    lie: 0,
    senseMotive: 0,
    legerdemain: 0,
    hacking: 0,
    pickLocks: 0,
    advancedSecurity: 0,
  },
};

export const COMPANION_TEMPLATE: NewCompanion = {
  name: '',
  description: '',
  acl: {},
  type: 'companion',
  attack: 0,
  defend: 0,
  armor: 0,
  health: {
    edge: 0,
    maxPool: 5,
    currentPool: 5,
    wound: false,
  },
  loyalty: {
    edge: 0,
    maxPool: 5,
    currentPool: 5,
    wound: false,
  },
  skills: {},
};

export const SKILLS: { [name in SkillNames]: SkillDescription } = {
  movement: {
    name: 'movement',
    description: '',
    attributes: ['might', 'speed'],
  },
  riding: {
    name: 'riding',
    description: '',
    attributes: ['speed', 'conviction'],
  },
  piloting: {
    name: 'piloting',
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
  senseMotive: { name: 'Sense Motive', description: '', attributes: ['focus'] },
  legerdemain: { name: 'Legerdemain', description: '', attributes: ['speed'] },
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
};
