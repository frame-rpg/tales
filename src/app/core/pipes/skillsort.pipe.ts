import { Pipe, PipeTransform } from '@angular/core';

import { CharacterSkill } from 'types/skill';
import { skillSort } from 'src/app/data/util';

@Pipe({
  name: 'skillsort',
})
export class SkillsortPipe implements PipeTransform {
  transform(value: CharacterSkill[]): CharacterSkill[] {
    return value.concat().sort(skillSort);
  }
}
