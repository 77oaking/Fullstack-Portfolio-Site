import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import type {
  ContactMessageInput,
  PortfolioBundle,
  ResponsePayload,
} from '@portfolio/shared-types';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);

  readonly bundle = signal<PortfolioBundle | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http
      .get<ResponsePayload<PortfolioBundle>>(`${environment.apiBaseUrl}/portfolio`)
      .pipe(
        tap({
          next: (res) => {
            this.bundle.set(res.data ?? null);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(err?.error?.message ?? err.message ?? 'Failed to load portfolio');
            this.loading.set(false);
          },
        }),
      )
      .subscribe({ next: () => {}, error: () => {} });
  }

  submitContact(payload: ContactMessageInput): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${environment.apiBaseUrl}/contact`, payload);
  }
}
