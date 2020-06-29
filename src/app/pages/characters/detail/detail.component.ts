import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';

import { Character } from 'src/types/character';
import { CharacterService } from '../../../data/character.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  character: Observable<Character>;

  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.character = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.characterService.get(params.get('id'))
      ),
      publishReplay(1),
      refCount()
    );
  }
}
