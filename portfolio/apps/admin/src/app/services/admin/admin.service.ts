import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import type { ResponsePayload } from '@portfolio/shared-types';

const BASE = `${environment.apiBaseLink}/api/v1/admin`;

interface LoginResponse extends ResponsePayload {
  token?: string;
  tokenExpiredIn?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private readonly http: HttpClient, private readonly storage: StorageService) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${BASE}/login`, { username, password })
      .pipe(
        tap((res) => {
          if (res.success && res.token && res.tokenExpiredIn) {
            this.storage.setToken(res.token, res.tokenExpiredIn);
            const data = res.data as { _id: string; username: string; name: string } | undefined;
            if (data) this.storage.setProfile(data);
          }
        }),
      );
  }

  me(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${BASE}/me`);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${BASE}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  logout(): void {
    this.storage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.storage.getToken();
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  getProfileName(): string {
    return this.storage.getProfile()?.name ?? 'Admin';
  }
}
