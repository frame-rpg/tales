import { Component, OnInit } from '@angular/core';
import {
  map,
  publishBehavior,
  publishLast,
  publishReplay,
  refCount,
  switchMap,
  tap,
} from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Campaign } from 'types/campaign';
import { CampaignService } from 'src/app/data/campaign.service';
import { Observable } from 'rxjs';
import { User } from 'types/user';
import { UserService } from '../user.service';

@Component({
  selector: 'framesystem-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: Observable<User>;
  name: Observable<string>;
  avatar: Observable<string>;
  canCreate: Observable<boolean>;
  unverified: Observable<boolean>;
  campaigns: Observable<Campaign[]>;
  editing = false;

  constructor(
    private auth: AngularFireAuth,
    private campaignService: CampaignService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.loggedInData.pipe(
      publishReplay(1),
      refCount()
    );
    this.name = this.user.pipe(map((u) => u.name));
    this.avatar = this.user.pipe(map((u) => u.avatar));
    this.canCreate = this.userService
      .hasPrivilege('premium')
      .pipe(publishReplay(1), refCount());
    this.unverified = this.userService.userIsEmailVerified().pipe(
      map((v) => !v),
      publishReplay(1),
      refCount()
    );
    this.campaigns = this.campaignService.list(['player', 'gm', 'viewer']);
  }

  logout() {
    this.userService.logout();
  }
}
