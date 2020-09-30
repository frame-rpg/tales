import * as Hammer from 'hammerjs';

import {
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
} from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { RulesComponent } from './static/rules.component';
import { ViewComponent } from './view/view.component';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    let mc = new Hammer(element, {
      touchAction: 'pan-y',
    });
    mc.get('swipe').set({ enable: true, direction: Hammer.DIRECTION_ALL });
    return mc;
  }
}

@NgModule({
  declarations: [ViewComponent, EditComponent, RulesComponent],
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    MatSidenavModule,
    RouterModule,
    HammerModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [
    {
      // hammer instantion with custom config
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    },
  ],
})
export class PagesModule {}
