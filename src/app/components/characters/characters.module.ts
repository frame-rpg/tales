import { ActionsModule } from 'src/app/actions/actions.module';
import { CardComponent } from './card/card.component';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../core/material/material.module';
import { NgModule } from '@angular/core';
import { NotesModule } from '../notes/notes.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SheetComponent } from './sheet/sheet.component';
import { SmallcardComponent } from './smallcard/smallcard.component';

@NgModule({
  declarations: [
    CardComponent,
    CreateComponent,
    SmallcardComponent,
    SheetComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    NotesModule,
    PipesModule,
    SharedModule,
    ActionsModule,
  ],
  exports: [CardComponent, CreateComponent, SmallcardComponent, SheetComponent],
})
export class CharactersModule {}
