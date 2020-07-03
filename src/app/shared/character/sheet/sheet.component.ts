import { Component, Input } from '@angular/core';

import { Character } from 'src/types/character';

@Component({
  selector: 'character-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent {
  @Input() character: Character;
  constructor() {}
}
