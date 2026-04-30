import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { ResponsePayload, Settings } from '@portfolio/shared-types';

const URL = `${environment.apiBaseLink}/api/v1/settings`;

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private readonly http: HttpClient) {}

  get(): Observable<ResponsePayload<Settings>> {
    return this.http.get<ResponsePayload<Settings>>(URL);
  }

  update(data: Partial<Settings>): Observable<ResponsePayload<Settings>> {
    return this.http.put<ResponsePayload<Settings>>(URL, data);
  }
}
