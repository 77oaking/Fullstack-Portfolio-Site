import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminService } from '../services/admin/admin.service';

/**
 * Injects the admin token into every outgoing request as the custom header
 * `administrator` — matching rone-api's convention. Note: the API also
 * accepts requests without the header (public endpoints), so this is
 * additive, not gating.
 */
@Injectable()
export class AuthAdminInterceptor implements HttpInterceptor {
  constructor(private readonly admin: AdminService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.admin.getToken();
    if (token) {
      const cloned = req.clone({
        setHeaders: { administrator: token },
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
