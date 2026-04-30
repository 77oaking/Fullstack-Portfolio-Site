import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, RouterModule, MaterialModule, HomeRoutingModule],
})
export class HomeModule {}
