import { Component, Input, OnInit } from '@angular/core';
import { publishReplay, refCount } from 'rxjs/operators';

import { Character } from 'src/types/character';
import { CharacterService } from 'src/app/data/character.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'character-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent implements OnInit {
  @Input() characterId: string;
  @Input() character: Observable<Character>;
  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    if (!this.character) {
      this.character = this.characterService
        .get(this.characterId)
        .pipe(publishReplay(1), refCount()) as Observable<Character>;
    }
  }
}
