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
export class AttributesComponent {
  @Input() character: PlayerCharacter | Companion;

  constructor() {}
}
