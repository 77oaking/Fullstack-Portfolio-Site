import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { AdminService } from '../services/admin/admin.service';

/** Allow only authenticated admins; redirect to /login otherwise. */
@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly admin: AdminService, private readonly router: Router) {}

  canActivate(): boolean | UrlTree {
    if (this.admin.isLoggedIn()) return true;
    return this.router.parseUrl('/login');
  }
}
