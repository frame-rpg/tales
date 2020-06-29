import { Component, Input, OnInit } from '@angular/core';
import { filter, map } from 'rxjs/operators';

import { Companion } from 'src/types/companion';
import { Observable } from 'rxjs';
import { PlayerCharacter } from 'src/types/player_character';

@Component({
  selector: 'attributes-block',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss'],
})
export class AttributesComponent implements OnInit {
  @Input() character: Observable<PlayerCharacter | Companion>;

  skillList: Observable<{ name: string; edge: number; pool: number }[]>;

  constructor() {}

  ngOnInit(): void {
    this.skillList = this.character.pipe(
      filter((v) => !!v),
      map((v) => {
        if (v.type === 'player') {
          return [
            {
              name: 'Might',
              edge: v.attributes.might.edge,
              pool: v.attributes.might.pool,
            },
            {
              name: 'Speed',
              edge: v.attributes.speed.edge,
              pool: v.attributes.speed.pool,
            },
            {
              name: 'Conviction',
              edge: v.attributes.conviction.edge,
              pool: v.attributes.conviction.pool,
            },
            {
              name: 'Focus',
              edge: v.attributes.focus.edge,
              pool: v.attributes.focus.pool,
            },
            {
              name: 'Health',
              edge: v.attributes.health.edge,
              pool: v.attributes.health.pool,
            },
          ];
        } else if (v.type === 'companion') {
          return [
            {
              name: 'Loyalty',
              edge: v.attributes.loyalty.edge,
              pool: v.attributes.loyalty.pool,
            },
            {
              name: 'Health',
              edge: v.attributes.health.edge,
              pool: v.attributes.health.pool,
            },
          ];
        }
      })
    );
  }
}
