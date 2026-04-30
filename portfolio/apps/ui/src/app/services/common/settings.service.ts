import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, map, shareReplay, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { ResponsePayload, Settings } from '@portfolio/shared-types';

const URL = `${environment.apiBaseLink}/api/v1/settings`;

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly cache$ = new ReplaySubject<Settings>(1);

  constructor(private readonly http: HttpClient) {
    this.refresh();
  }

  /** Observable site-wide settings; cached after first fetch. */
  get(): Observable<Settings> {
    return this.cache$.asObservable().pipe(shareReplay(1));
  }

  refresh(): void {
    this.http
      .get<ResponsePayload<Settings>>(URL)
      .pipe(
        map((r) => r.data as Settings),
        tap((s) => this.cache$.next(s)),
      )
      .subscribe({
        error: (err) => console.warn('[SettingsService] failed to load', err),
      });
  }
}
