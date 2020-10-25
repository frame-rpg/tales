import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Injectable, NgModule } from '@angular/core';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/core/material/material.module';
import { NotesComponent } from './notes.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NotesComponent],
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [NotesComponent],
})
export class NotesModule {}
