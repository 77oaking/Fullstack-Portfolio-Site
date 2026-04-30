import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { ResponsePayload, Theme } from '@portfolio/shared-types';

const BASE = `${environment.apiBaseLink}/api/v1/themes`;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor(private readonly http: HttpClient) {}

  list(): Observable<ResponsePayload<Theme[]>> {
    return this.http.get<ResponsePayload<Theme[]>>(BASE);
  }

  active(): Observable<ResponsePayload<Theme>> {
    return this.http.get<ResponsePayload<Theme>>(`${BASE}/active`);
  }

  byId(themeId: string): Observable<ResponsePayload<Theme>> {
    return this.http.get<ResponsePayload<Theme>>(`${BASE}/by-id/${themeId}`);
  }

  activate(themeId: string): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${BASE}/activate/${themeId}`, {});
  }

  create(data: Partial<Theme>): Observable<ResponsePayload<{ _id: string }>> {
    return this.http.post<ResponsePayload<{ _id: string }>>(BASE, data);
  }

  update(id: string, data: Partial<Theme>): Observable<ResponsePayload<Theme>> {
    return this.http.put<ResponsePayload<Theme>>(`${BASE}/${id}`, data);
  }

  remove(id: string): Observable<ResponsePayload> {
    return this.http.delete<ResponsePayload>(`${BASE}/${id}`);
  }
}
