import { Component, Input, OnInit } from '@angular/core';

import { Character } from 'src/app/types/character';

@Component({
  selector: 'character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent implements OnInit {
  @Input() character: Character;
  @Input() showLink: boolean;
  constructor() {}

  ngOnInit(): void {}
}
