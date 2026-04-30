import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { AddProjectComponent } from './add-project/add-project.component';

const routes: Routes = [
  { path: '', component: AllProjectsComponent },
  { path: 'add', component: AddProjectComponent },
  { path: 'edit/:id', component: AddProjectComponent },
];

@NgModule({
  declarations: [AllProjectsComponent, AddProjectComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, RouterModule.forChild(routes)],
})
export class ProjectsAdminModule {}
