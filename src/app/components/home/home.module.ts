import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { NgModule } from '@angular/core';
import { RouteComponent } from './route.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HomeComponent, RouteComponent],
  imports: [CommonModule, FormsModule, MaterialModule, RouterModule],
  exports: [RouteComponent, HomeComponent],
})
export class HomeModule {}
