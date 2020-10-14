import { CharacterSkill, Skill } from '../../types/skill';

import { AttributeName } from '../../types/attribute';
import { Character } from '../../types/character';
import { Item } from '../../types/item';
import { ulid } from 'ulid';

export function attr<T extends AttributeName>(v: number, e: number, n: T) {
  return {
    name: n,
    edge: e,
    current: v,
    pool: v,
    wound: false,
  };
}

export function skillBlock(
  base: Skill[],
  { inept, proficient, trained, expert }: Record<string, string[]>
): CharacterSkill[] {
  return base.map((skill) => {
    if (inept.includes(skill.skillId)) {
      return { ...skill, level: 'inept' };
    } else if (proficient.includes(skill.skillId)) {
      return { ...skill, level: 'proficient' };
    } else if (trained.includes(skill.skillId)) {
      return { ...skill, level: 'trained' };
    } else if (expert.includes(skill.skillId)) {
      return { ...skill, level: 'expert' };
    }
    return { ...skill, level: 'unskilled' };
  });
}

export function addItem(c: Character, i: Item) {
  const owner = {
    characterId: c.characterId,
    campaignId: c.campaignId,
    itemId: ulid(),
  };
  c.equipment[owner.itemId] = JSON.parse(JSON.stringify({ ...i, owner }));
}
