import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { CharacterAttribute } from 'src/types/attribute';
import { Companion } from 'src/types/companion';
import { Observable } from 'rxjs';
import { PlayerCharacter } from 'src/types/player_character';

interface DisplayAttribute extends CharacterAttribute {
  wound: boolean;
  current: number;
  name: string;
}

@Component({
  selector: 'attributes-block',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
})
export class AttributesComponent implements OnChanges {
  @Input() character: PlayerCharacter | Companion;

  attributes: DisplayAttribute[];

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.character.firstChange ||
      changes.character.currentValue.attributes !==
        changes.character.previousValue.attributes ||
      changes.character.currentValue.status.pool !==
        changes.character.previousValue.status.pool
    ) {
      const character = changes.character.currentValue;
      const names =
        character.type === 'player'
          ? ['might', 'speed', 'conviction', 'focus', 'health']
          : ['loyalty', 'health'];
      this.attributes = names.map((attr) => {
        return {
          ...character.attributes[attr],
          name: attr,
          current:
            character.status?.pools?.[attr]?.current >= 0
              ? character.status?.pools?.[attr]?.current
              : character.attributes[attr].pool,
          wound: character.status?.pools?.[attr]?.wound || false,
        };
      });
    }
  }
}
