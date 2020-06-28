import {
  COMPANION_TEMPLATE,
  CharacterService,
  NONPLAYER_TEMPLATE,
  PLAYER_TEMPLATE,
} from '../../../data/character.service';
import { Component, OnInit } from '@angular/core';

import { Character } from 'src/app/types/character';
import { CharacterTypes } from 'src/app/types/character_base';
import { CreateComponent } from '../create/create.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
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
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.list$ = this.characterService.list();
  }

  openAdd() {
    this.dialog
      .open(CreateComponent)
      .afterClosed()
      .subscribe(async (v?: { name: string; type: CharacterTypes }) => {
        if (v) {
          let toBeCreated;
          if (v.type === 'companion') {
            toBeCreated = {
              ...COMPANION_TEMPLATE,
              name: v.name,
            };
          } else if (v.type === 'nonplayer') {
            toBeCreated = {
              ...NONPLAYER_TEMPLATE,
              name: v.name,
            };
          } else if (v.type === 'player') {
            toBeCreated = {
              ...PLAYER_TEMPLATE,
              name: v.name,
            };
          }
          if (toBeCreated) {
            const created = await this.characterService.create(toBeCreated);
            this.router.navigate(['/characters', created.id]);
          }
        }
      });
  }
}
