import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';

import { Character } from 'src/types/character';
import { CharacterService } from 'src/app/data/character.service';
import { CreateService } from 'src/app/shared/character/create/create.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  list$: Observable<Character[]>;

  constructor(
    private characterService: CharacterService,
    private router: Router,
    private createService: CreateService
  ) {}

  ngOnInit(): void {
    this.list$ = this.characterService.list();
  }

  async openAdd() {
    const result = await this.createService.createCharacter();
    if (result) {
      this.router.navigate(['characters', result.id]);
    }
  }
}
