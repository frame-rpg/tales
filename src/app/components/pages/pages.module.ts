import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { FramesystemRenderer } from './staticRenderer';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgModule } from '@angular/core';
import { RulesComponent } from './static/rules.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [ViewComponent, EditComponent, RulesComponent],
  imports: [
    CommonModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          renderer: new FramesystemRenderer(),
          gfm: true,
          breaks: false,
          pedantic: false,
          smartLists: true,
          smartypants: false,
        },
      },
    }),
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class PagesModule {}
