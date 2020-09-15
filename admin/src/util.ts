import { CharacterSkill, Skill } from '../../types/skill';

import { AttributeName } from '../../types/attribute';

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
