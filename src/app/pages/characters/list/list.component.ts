import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';

import { Character } from 'src/types/character';
import { CharacterService } from 'src/app/data/character.service';
import { CreateComponent } from '../create/create.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RulesService } from 'src/app/data/rules.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  list$: Observable<Character[]>;

  constructor(
    private characterService: CharacterService,
    private rulesService: RulesService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.list$ = this.characterService.list();
  }

  openAdd() {
    combineLatest([
      this.rulesService.templates(),
      this.dialog.open(CreateComponent).afterClosed(),
    ])
      .pipe(take(1))
      .subscribe(async ([templates, result]) => {
        if (result) {
          const created = await this.characterService.create({
            ...templates[result.type],
            name: result.name,
          });
          this.router.navigate(['/characters', created.id]);
        }
      });
  }
}
