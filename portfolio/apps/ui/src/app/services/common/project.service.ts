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

  getAll(body: FilterAndPagination = {}): Observable<ResponsePayload<Project[]>> {
    return this.http.post<ResponsePayload<Project[]>>(`${BASE}/get-all`, body);
  }

  getFeatured(): Observable<ResponsePayload<Project[]>> {
    return this.http.get<ResponsePayload<Project[]>>(`${BASE}/featured`);
  }

  getBySlug(slug: string): Observable<ResponsePayload<Project>> {
    return this.http.get<ResponsePayload<Project>>(`${BASE}/by-slug/${slug}`);
  }
}
