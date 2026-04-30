import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProjectsRoutingModule } from './projects-routing.module';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [AllProjectsComponent, ProjectDetailsComponent],
  imports: [CommonModule, RouterModule, MaterialModule, ProjectsRoutingModule],
})
export class ProjectsModule {}
