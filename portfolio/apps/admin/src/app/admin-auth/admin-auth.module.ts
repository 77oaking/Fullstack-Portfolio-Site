import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { LoginComponent } from './login/login.component';

const routes: Routes = [{ path: '', component: LoginComponent }];

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule.forChild(routes)],
})
export class AdminAuthModule {}
