import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { Character } from 'src/types/character';
import { CharacterService } from 'src/app/data/character.service';
import { Roll } from 'src/types/event';
import { User } from 'src/types/user';
import { UserService } from 'src/app/data/user.service';

@Component({
  selector: 'roll',
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.scss'],
})
export class RollComponent implements OnInit, OnChanges {
  @Input() roll: Roll;
  private rollSubject = new BehaviorSubject<Roll>(null);
  roll$ = this.rollSubject.asObservable().pipe(
    publishReplay(1),
    refCount(),
    filter((v) => !!v),
    distinctUntilChanged()
  );
  userIsRoller: Observable<boolean>;
  userRequestedRoll: Observable<boolean>;
  roller: Observable<Character>;
  requester: Observable<User>;

  constructor(
    private auth: AngularFireAuth,
    private characterService: CharacterService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.roller = this.roll$.pipe(
      switchMap((roll) => this.characterService.get(roll.roller))
    );

    this.requester = this.roll$.pipe(
      switchMap((roll) => this.userService.get(roll.requester))
    );

    this.userIsRoller = combineLatest([this.roller, this.auth.user]).pipe(
      map(([roller, user]) => roller.acl[user.uid] === 'admin')
    );

    this.userRequestedRoll = combineLatest([this.roll$, this.auth.user]).pipe(
      map(([roll, user]) => roll.requester === user.uid)
    );
  }

  ngOnChanges(update) {
    this.rollSubject.next(update.roll.currentValue);
  }
}
