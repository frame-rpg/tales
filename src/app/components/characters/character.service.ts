import { Ability, AbilityType } from 'types/ability';
import { CampaignId, CharacterId, UserId } from 'types/idtypes';
import { Character, SkilledCharacter } from 'types/character';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';

import { AclType } from 'types/acl';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Effect } from 'types/effect';
import { Injectable } from '@angular/core';
import { Item } from 'types/item';
import { Observable } from 'rxjs';
import { SkillType } from 'types/skill';
import { addId } from '../../data/rxutil';
import { firestore } from 'firebase/app';
import { ulid } from 'ulid';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  async resetOne(character: SkilledCharacter) {
    const patch = Object.entries(character.attributes).reduce(
      (acc, [attrName, attrVal]) => ({
        ...acc,
        [`attributes.${attrName}.current`]: attrVal.pool,
        [`attributes.${attrName}.wound`]: false,
      }),
      {
        initiative: 0,
      }
    );
    await this.update(character, patch);
  }

  async reset(characters: Character[]) {
    await Promise.all(
      characters
        .filter((c) => c.subtype !== 'nonplayer')
        .map((character: SkilledCharacter) => this.resetOne(character))
    );
  }

  async restOne(character: SkilledCharacter) {
    const patch = Object.entries(character.attributes).reduce(
      (acc, [attrName, attrVal]) => ({
        ...acc,
        [`attributes.${attrName}.current`]: Math.min(
          attrVal.pool,
          attrVal.current + Math.ceil(attrVal.pool / 5)
        ),
      }),
      {
        initiative: 0,
      }
    );
    await this.update(character, patch);
  }

  abilities(
    character: SkilledCharacter,
    filter: { skills?: string[]; category?: SkillType },
    type: AbilityType
  ): Ability[] {
    const undepletedAbilities = Object.values(character.equipment)
      .filter((e) => e.equipped)
      .flatMap((item) =>
        item.abilities
          .filter((ability) => ability.type === type)
          .filter(
            (ability) =>
              !('category' in filter || 'skills' in filter) ||
              ('category' in ability && ability.category === filter.category) ||
              ('skills' in ability &&
                ability.skills?.some((skill) => filter.skills?.includes(skill)))
          )
          .filter(
            (ability) =>
              !item.depleted ||
              ability.costs.every((cost) => cost.type !== 'depletion')
          )
          .map((ability) => ({
            ...ability,
            from: item.owner,
          }))
      );

    const characterAbilities = character.abilities.filter(
      (ability) => ability.type === type
    );
    return [...undepletedAbilities, ...characterAbilities];
  }

  actions(
    character: SkilledCharacter,
    filter: { skills?: string[]; category?: SkillType }
  ) {
    return this.abilities(character, filter, 'action');
  }

  reactions(
    character: SkilledCharacter,
    filter: { skills?: string[]; category?: SkillType }
  ) {
    return this.abilities(character, filter, 'replace');
  }

  modifiers(
    character: SkilledCharacter,
    filter: { skills?: string[]; category?: SkillType }
  ) {
    return this.abilities(character, filter, 'modifier');
  }

  passives(
    character: SkilledCharacter,
    filter: { skills?: string[]; category?: SkillType }
  ): { abilities: Ability[]; auras: Effect[] } {
    const abilities = this.abilities(character, filter, 'passive');
    const auras = character.auras.filter(
      (aura) =>
        (aura.type === 'bonus' &&
          'category' in filter &&
          filter.category === aura.category) ||
        ('skills' in filter &&
          filter.skills.some((skill) => aura.skills?.includes(skill)))
    );
    return { abilities, auras };
  }

  async giveItem(character: SkilledCharacter, item: Item) {
    const owner = {
      characterId: character.characterId,
      campaignId: character.campaignId,
      itemId: ulid(),
    };
    await this.update(character, {
      carried: firestore.FieldValue.arrayUnion({ ...item, owner }),
    });
  }

  async deplete(item: {
    characterId: string;
    campaignId: string;
    itemId: string;
  }) {}

  async rest(characters: Character[]) {
    await Promise.all(
      characters
        .filter((c) => c.subtype !== 'nonplayer')
        .map((character: SkilledCharacter) => this.restOne(character))
    );
  }

  private containerAddress(id: UserId | CampaignId): string {
    if (id.type === 'user') {
      return `/users/${id.userId}/characters`;
    } else {
      return `/campaigns/${id.campaignId}/characters`;
    }
  }

  private characterAddress(id: CharacterId): string {
    return `/campaigns/${id.campaignId}/characters/${id.characterId}`;
  }

  list(id: CampaignId): Observable<Character[]>;
  list(id: CampaignId, acl: AclType[]): Observable<Character[]>;
  list(id: CampaignId, acl?: AclType[]): Observable<Character[]> {
    return this.auth.user.pipe(
      switchMap((user) =>
        this.firestore
          .collection<Character>(this.containerAddress(id), (query) =>
            acl && acl.length > 0
              ? query.where(`acl.${user.uid}`, 'in', acl)
              : query
          )
          .valueChanges({ idField: 'characterId' })
      )
    );
  }

  get(id: CharacterId): Observable<Character> {
    return this.firestore
      .doc<Character>(this.characterAddress(id))
      .snapshotChanges()
      .pipe(addId('characterId'), publishReplay(1), refCount());
  }

  update(id: CharacterId, character: any) {
    return this.firestore.doc(this.characterAddress(id)).update(character);
  }

  equip(id: CharacterId, item: string, equipped: boolean) {
    return this.update(id, { [`equipment.${item}.equipped`]: equipped });
  }

  setInitiative(id: CharacterId, initiative: number) {
    return this.update(id, { initiative });
  }
}

function applyFilter(
  ability: Ability,
  filter: { skills: string[] } | { category: SkillType }
): boolean {
  if ('category' in filter) {
    return filter.category === ability.category;
  } else {
    return filter.skills.some((skill) => ability.skills?.includes(skill));
  }
}

function itemEffect(
  ability: Ability,
  item: Item,
  filter: { type: AbilityType } & (
    | { skills: string[] }
    | { category: SkillType }
  )
): boolean {
  return (
    ability.type === filter.type &&
    applyFilter(ability, filter) &&
    (!item.depleted || ability.costs.every((cost) => cost.type !== 'depletion'))
  );
}
