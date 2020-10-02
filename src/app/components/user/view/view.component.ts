import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, publishReplay, refCount, switchMap, tap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'types/user';
import { UserService } from '../user.service';

@Component({
  selector: 'framesystem-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  user: Observable<User>;
  name: Observable<string>;
  avatar: Observable<string>;
  canEdit: Observable<boolean>;

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

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
    this.canEdit = combineLatest([
      this.userService.hasPrivilege('admin'),
      this.auth.user,
      this.route.paramMap.pipe(map((params) => params.get('userId'))),
    ]).pipe(map(([admin, { uid }, userId]) => admin || uid === userId));
  }
}
