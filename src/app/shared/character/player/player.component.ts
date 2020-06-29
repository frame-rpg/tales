import { Component, Input, OnInit } from '@angular/core';
import { publishReplay, refCount } from 'rxjs/operators';

import { CharacterService } from 'src/app/data/character.service';
import { Observable } from 'rxjs';
import { PlayerCharacter } from 'src/types/player_character';

@Component({
  selector: 'player-character',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  @Input() characterId: string;
  @Input() character: Observable<PlayerCharacter>;
  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    if (!this.character) {
      this.character = this.characterService
        .get(this.characterId)
        .pipe(publishReplay(1), refCount()) as Observable<PlayerCharacter>;
    }
  }
}
