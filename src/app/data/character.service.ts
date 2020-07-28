import { Character, NewCharacter, SkilledCharacter } from 'src/types/character';
import {
  DisplaySkill,
  SkillDescription,
  SkillDetails,
  SkillLevels,
} from 'src/types/skill';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { DisplayAttribute } from 'src/types/attribute';
import { Injectable } from '@angular/core';
import { RulesService } from './rules.service';

const characterAttributeNames = {
  player: ['might', 'speed', 'conviction', 'focus', 'health'],
  companion: ['loyalty', 'health'],
};

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private rulesService: RulesService
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

  get(campaignId: string, id: string) {
    return this.firestore
      .doc<Character>(`/campaigns/${campaignId}/characters/${id}`)
      .snapshotChanges()
      .pipe(
        map((v) => ({ id: v.payload.id, ...v.payload.data() } as Character))
      );
  }

  update(character: Partial<Character> & { id: string }) {
    return this.firestore.doc(`/characters/${character.id}`).update(character);
  }

  async create(character: NewCharacter, options: { inCampaign?: string } = {}) {
    const user = await this.auth.currentUser;
    const toAdd = { ...character };
    toAdd.acl[user.uid] = 'admin';
    if (options?.inCampaign) {
      return this.firestore
        .collection(`/campaigns/${options.inCampaign}/characters`)
        .add(toAdd);
    } else {
      return this.firestore.collection('/characters').add(toAdd);
    }
  }

  mapDisplayAttributes(
    character: Observable<Character>
  ): Observable<DisplayAttribute[]> {
    return character.pipe(
      filter(
        (character) =>
          character.type === 'player' || character.type === 'companion'
      ),
      map((character: SkilledCharacter) =>
        characterAttributeNames[character.type].map((attr) => ({
          ...character.attributes[attr],
          name: attr,
          ...(character.status?.pools?.[attr] || {
            wound: false,
            current: character.attributes[attr].pool,
          }),
        }))
      )
    );
  }

  mapDisplaySkills(
    character: Observable<Character>,
    skills: Observable<string[]>
  ): Observable<DisplaySkill[]> {
    return combineLatest([
      this.rulesService.skillLevels(),
      this.rulesService.skillInfo(),
      skills,
      character,
    ]).pipe(
      filter(([, , , character]) => !!character),
      filter(
        ([, , , character]) =>
          character.type === 'player' || character.type === 'companion'
      ),
      map(
        ([skillLevels, skillInfo, skills, character]: [
          SkillLevels,
          SkillDetails,
          string[],
          SkilledCharacter
        ]) =>
          skills.map((skill) => ({
            id: skill,
            name: skillInfo[skill].name,
            level: character.skills[skill],
            levelName: skillLevels[character.skills[skill]],
            description: skillInfo[skill].description,
            attributes: skillInfo[skill].attributes,
          }))
      )
    );
  }
}

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
