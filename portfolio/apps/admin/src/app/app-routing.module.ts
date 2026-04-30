import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminAuthGuard } from './auth-guard/admin-auth.guard';
import { AdminAuthStateGuard } from './auth-guard/admin-auth-state.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [AdminAuthStateGuard],
    loadChildren: () => import('./admin-auth/admin-auth.module').then((m) => m.AdminAuthModule),
  },
  {
    path: '',
    canActivate: [AdminAuthGuard],
    loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
