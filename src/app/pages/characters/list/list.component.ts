import { Component, OnInit } from '@angular/core';

import { Character } from '../../../types/character';
import { CharacterService } from '../../../data/character.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  list$: Observable<Character[]>;
  constructor(private characterService: CharacterService) {}
  ngOnInit(): void {
    this.list$ = this.characterService.list();
  }
}
