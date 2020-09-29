import { Component, Input } from '@angular/core';

import { Character } from 'types/character';
import { CharacterService } from '../../data/character.service';

@Component({
  selector: 'adjust-character',
  templateUrl: './adjust.component.html',
  styleUrls: ['./adjust.component.scss'],
})
export class AdjustComponent {
  @Input() character: Character;
  @Input() path: string;
  @Input() max: number;
  @Input() min: number = 0;
  @Input() increment: number;
  color = 'accent';

  constructor(private characterService: CharacterService) {}

  async fire() {
    const v = await this.characterService.update(this.character, {
      [this.path]:
        this.increment === 0
          ? 0
          : Math.min(Math.max(this.increment + this.value, this.min), this.max),
    });
    console.log(v);
  }

  get value() {
    return pathGet(this.path.split('.'), this.character);
  }
}

function pathGet(path: string[], item: any) {
  return path.reduce((acc, curr) => acc[curr], item);
}
