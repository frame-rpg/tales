import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  distinctUntilKeyChanged,
  filter,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs/operators';

import { Character } from 'types/character';
import { CharacterId } from 'types/idtypes';
import { CharacterService } from '../character.service';

@Component({
  selector: 'framesystem-character-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
})
export class SheetComponent implements OnChanges, OnInit {
  @Input('character') private character_: CharacterId;
  characterIdSubject = new BehaviorSubject<CharacterId>(null);
  character: Observable<Character>;

  constructor(private characterService: CharacterService) {}

  ngOnInit() {
    this.character = this.characterIdSubject.asObservable().pipe(
      filter((v) => !!v),
      tap((v) => console.log(v)),
      distinctUntilKeyChanged('characterId'),
      switchMap((id) => this.characterService.get(id)),
      publishReplay(1),
      refCount()
    );
  }

  ngOnChanges(): void {
    console.log(this.character_);
    if (this.character_) {
      this.characterIdSubject.next(this.character_);
    }
  }
}
