import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { ResponsePayload } from '@portfolio/shared-types';

import { environment } from '../../environments/environment';

/**
 * Tiny helper layered on top of HttpClient so each entity service is just
 * three lines: `class FooService extends ApiResource<Foo> { constructor() { super('foo'); } }`
 *
 * Path is the API segment, e.g. 'experience' → /api/experience.
 */
export abstract class ApiResource<T> {
  protected abstract readonly path: string;
  protected readonly base = environment.apiBaseUrl;

  protected constructor(protected readonly http: HttpClient) {}

  list(): Observable<ResponsePayload<T[]>> {
    return this.http.get<ResponsePayload<T[]>>(`${this.base}/${this.path}`);
  }

  one(id: string): Observable<ResponsePayload<T>> {
    return this.http.get<ResponsePayload<T>>(`${this.base}/${this.path}/${id}`);
  }

  create(body: Partial<T>): Observable<ResponsePayload<T>> {
    return this.http.post<ResponsePayload<T>>(`${this.base}/${this.path}`, body);
  }

  update(id: string, body: Partial<T>): Observable<ResponsePayload<T>> {
    return this.http.put<ResponsePayload<T>>(`${this.base}/${this.path}/${id}`, body);
  }

  remove(id: string): Observable<ResponsePayload<T>> {
    return this.http.delete<ResponsePayload<T>>(`${this.base}/${this.path}/${id}`);
  }
}

export abstract class SingletonResource<T> {
  protected abstract readonly path: string;
  protected readonly base = environment.apiBaseUrl;

  protected constructor(protected readonly http: HttpClient) {}

  get(): Observable<ResponsePayload<T | null>> {
    return this.http.get<ResponsePayload<T | null>>(`${this.base}/${this.path}`);
  }

  upsert(body: Partial<T>): Observable<ResponsePayload<T>> {
    return this.http.put<ResponsePayload<T>>(`${this.base}/${this.path}`, body);
  }
}
