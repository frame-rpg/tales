import { Component, Input, OnInit } from '@angular/core';

import { NonplayerCharacter } from 'src/types/nonplayer_character';

@Component({
  selector: 'nonplayer-character',
  templateUrl: './nonplayer.component.html',
  styleUrls: ['./nonplayer.component.scss'],
})
export class NonplayerComponent {
  @Input() character: NonplayerCharacter;
  constructor() {}
}
