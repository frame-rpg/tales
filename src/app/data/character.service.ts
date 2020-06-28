import { Character, NewCharacter } from '../types/character';
import { map, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { NewCharacterBase } from '../types/character_base';
import { NewCompanion } from '../types/companion';
import { NewNonplayerCharacter } from '../types/nonplayer_character';
import { NewPlayerCharacter } from '../types/player_character';

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
    pool: 5,
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
    pool: 5,
  },
  conviction: {
    edge: 0,
    pool: 5,
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
    pool: 5,
  },
  loyalty: {
    edge: 0,
    pool: 5,
  },
  skills: {},
};

export function levels(level: number) {
  if (level === -2) {
    return 'Inept';
  } else if (level === -1) {
    return 'Unskilled';
  } else if (level === 0) {
    return 'Proficient';
  } else if (level === 1) {
    return 'Trained';
  } else if (level === 2) {
    return 'Expert';
  }
}
