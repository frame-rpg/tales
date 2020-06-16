import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Character } from '../character.model';
import { CharacterService } from '../character.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
})
export class CharacterDetailComponent implements OnInit {
  character$: Observable<Character>;

  constructor(
    private characterService: CharacterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.character$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.characterService.get(params.get('id'))
      )
    );
  }
}
