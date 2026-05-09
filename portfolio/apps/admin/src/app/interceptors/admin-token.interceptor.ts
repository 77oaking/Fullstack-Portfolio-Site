import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

/**
 * Adds the `administrator` header to every outgoing API request when an admin
 * token is present. This matches the API's custom header convention.
 */
@Injectable()
export class AdminTokenInterceptor implements HttpInterceptor {
  private readonly auth = inject(AuthService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.token();
    if (token) {
      const cloned = req.clone({ setHeaders: { administrator: token } });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
