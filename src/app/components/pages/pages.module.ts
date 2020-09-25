import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';



@NgModule({
  declarations: [ViewComponent, EditComponent],
  imports: [
    CommonModule
  ]
})
export class PagesModule { }
