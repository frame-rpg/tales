import { ActivatedRoute, ParamMap } from '@angular/router';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  filter,
  map,
  publishReplay,
  refCount,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { ImageSelectService } from 'src/app/shared/image-select.service';
import { User } from 'types/user';
import { UserService } from '../user.service';

interface Action {
  type: 'name' | 'avatar' | 'rollPreference';
  payload: string;
}

@Component({
  selector: 'framesystem-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  destroying_ = new BehaviorSubject<boolean>(false);
  destroying = this.destroying_.asObservable().pipe(filter((v) => v));
  actions_ = new Subject<Action>();

  editing = {
    name: false,
    avatar: false,
    rollPreference: false,
  };

  user: Observable<User>;
  name: Observable<string>;
  avatar: Observable<string>;
  rollPreference: Observable<string>;
  canEdit: Observable<boolean>;

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,
    private route: ActivatedRoute,
    private imageSelect: ImageSelectService
  ) {}

  ngOnDestroy() {
    this.destroying_.next(true);
  }

  check(a: any) {
    console.log(a);
  }

  ngOnInit(): void {
    this.user = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.userService.get(params.get('userId'))
      ),
      publishReplay(1),
      refCount()
    );
    this.name = this.user.pipe(map((u) => u.name));
    this.avatar = this.user.pipe(map((u) => u.avatar));
    this.rollPreference = this.user.pipe(map((u) => u.rollPreference));
    this.canEdit = combineLatest([
      this.userService.hasPrivilege('admin'),
      this.auth.user,
      this.route.paramMap.pipe(map((params) => params.get('userId'))),
    ]).pipe(map(([admin, { uid }, userId]) => admin || uid === userId));

    this.actions_
      .asObservable()
      .pipe(withLatestFrom(this.user), takeUntil(this.destroying))
      .subscribe(([action, user]) => {
        this.userService.update(user.userId, { [action.type]: action.payload });
      });
  }

  update(action: Action) {
    this.actions_.next(action);
    this.readonly();
  }

  async updateAvatar() {
    const avatar = await this.imageSelect.selectImage();
    if (avatar) {
      this.actions_.next({ type: 'avatar', payload: avatar });
    }
  }

  readonly() {
    this.editing.name = false;
    this.editing.avatar = false;
    this.editing.rollPreference = false;
  }
}
