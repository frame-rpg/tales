import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  distinctUntilKeyChanged,
  filter,
  map,
  publishReplay,
  refCount,
  takeUntil,
} from 'rxjs/operators';

import { ImageSelectService } from 'src/app/shared/image-select.service';
import { User } from 'types/user';
import { UserService } from '../user.service';

@Component({
  selector: 'framesystem-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    avatar: new FormControl(null, [Validators.required]),
  });

  destroying_ = new BehaviorSubject<boolean>(false);
  destroying = this.destroying_.asObservable().pipe(filter((v) => v));
  avatarUpdate = new Subject<string>();

  user: Observable<User>;
  name: Observable<String>;
  avatar: Observable<string>;

  constructor(
    private userService: UserService,
    private imageSelect: ImageSelectService
  ) {}

  ngOnDestroy(): void {
    this.destroying_.next(true);
  }

  ngOnInit(): void {
    this.user = this.userService.loggedInData.pipe(
      publishReplay(1),
      refCount()
    );
    this.name = this.user.pipe(map((u) => u.name));
    this.avatar = this.user.pipe(map((u) => u.avatar));
    combineLatest([this.user, this.avatarUpdate])
      .pipe(
        filter(([, url]) => !!url && url.length > 0),
        distinctUntilKeyChanged(1),
        takeUntil(this.destroying)
      )
      .subscribe(([{ userId }, url]) =>
        this.userService.update(userId, { avatar: url })
      );
  }

  async changeAvatar() {
    const avatar = await this.imageSelect.selectImage();
    if (avatar) {
      this.avatarUpdate.next(avatar);
    }
  }
}
