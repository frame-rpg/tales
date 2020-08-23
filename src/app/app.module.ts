import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActionsModule } from './actions/actions.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './core/material/material.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    CoreModule,
    MaterialModule,
    ActionsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
