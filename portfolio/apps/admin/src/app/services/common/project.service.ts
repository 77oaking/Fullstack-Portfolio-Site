import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type {
  FilterAndPagination,
  Project,
  ResponsePayload,
} from '@portfolio/shared-types';

const BASE = `${environment.apiBaseLink}/api/v1/projects`;

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private readonly http: HttpClient) {}

  // Admin: list everything regardless of status
  getAll(body: FilterAndPagination = {}): Observable<ResponsePayload<Project[]>> {
    return this.http.post<ResponsePayload<Project[]>>(`${BASE}/admin/get-all`, body);
  }

  getById(id: string): Observable<ResponsePayload<Project>> {
    return this.http.get<ResponsePayload<Project>>(`${BASE}/admin/${id}`);
  }

  create(data: Partial<Project>): Observable<ResponsePayload<{ _id: string }>> {
    return this.http.post<ResponsePayload<{ _id: string }>>(`${BASE}`, data);
  }

  update(id: string, data: Partial<Project>): Observable<ResponsePayload<Project>> {
    return this.http.put<ResponsePayload<Project>>(`${BASE}/${id}`, data);
  }

  remove(id: string): Observable<ResponsePayload> {
    return this.http.delete<ResponsePayload>(`${BASE}/${id}`);
  }

  reorder(ids: string[]): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${BASE}/reorder`, { ids });
  }
}
