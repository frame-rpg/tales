import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { MarkdownModule } from 'ngx-markdown';
import { NgModule } from '@angular/core';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [ViewComponent, EditComponent],
  imports: [CommonModule, MarkdownModule.forRoot()],
})
export class PagesModule {}
