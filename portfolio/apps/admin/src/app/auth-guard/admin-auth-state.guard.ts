import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { AdminService } from '../services/admin/admin.service';

/** Allow only UN-authenticated visitors; redirect to dashboard otherwise.
 *  Wraps the /login route so already-logged-in admins can't see the form. */
@Injectable({ providedIn: 'root' })
export class AdminAuthStateGuard implements CanActivate {
  constructor(private readonly admin: AdminService, private readonly router: Router) {}

  canActivate(): boolean | UrlTree {
    if (!this.admin.isLoggedIn()) return true;
    return this.router.parseUrl('/');
  }
}
