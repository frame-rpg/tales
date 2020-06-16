import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from '../character.model';
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
})
export class CharacterListComponent implements OnInit {
  list$: Observable<Character[]>;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.list$ = this.characterService.list();
  }
}
