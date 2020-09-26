import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgModule } from '@angular/core';
import { ViewComponent } from './view/view.component';
import { RulesComponent } from './static/rules.component';

@NgModule({
  declarations: [ViewComponent, EditComponent, RulesComponent],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class PagesModule {}
