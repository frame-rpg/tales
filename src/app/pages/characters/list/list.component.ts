import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from 'src/app/types/character';
import { CharacterService } from 'src/app/data/character.service';

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
