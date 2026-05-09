import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { CvPublicPayload, ResponsePayload } from '@portfolio/shared-types';

const URL = `${environment.apiBaseLink}/api/v1/cv/public`;

@Injectable({ providedIn: 'root' })
export class CvService {
  constructor(private readonly http: HttpClient) {}

  getPublicCv(): Observable<ResponsePayload<CvPublicPayload>> {
    return this.http.get<ResponsePayload<CvPublicPayload>>(URL);
  }
}
