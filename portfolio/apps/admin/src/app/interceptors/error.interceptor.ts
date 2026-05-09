import { Injectable, inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly snackbar = inject(MatSnackBar);
  private readonly auth = inject(AuthService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.auth.logout();
        } else {
          const msg =
            (err.error && typeof err.error === 'object' && 'message' in err.error
              ? (err.error as { message: string }).message
              : err.message) || 'Request failed';
          this.snackbar.open(msg, 'Dismiss', { duration: 5000 });
        }
        return throwError(() => err);
      }),
    );
  }
}
