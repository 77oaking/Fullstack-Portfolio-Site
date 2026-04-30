import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ThemesListComponent } from './themes-list/themes-list.component';

const routes: Routes = [{ path: '', component: ThemesListComponent }];

@NgModule({
  declarations: [ThemesListComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class ThemesAdminModule {}
