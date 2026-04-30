import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllProjectsComponent } from './all-projects/all-projects.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

const routes: Routes = [
  { path: '', component: AllProjectsComponent },
  { path: ':slug', component: ProjectDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
