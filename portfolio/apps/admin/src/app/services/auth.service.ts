import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import type { Admin, ResponsePayload } from '@portfolio/shared-types';

import { environment } from '../../environments/environment';

interface RawLoginResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    username: string;
    name: string;
    lastLoggedIn?: string | null;
  };
  token?: string;
  tokenExpiredIn?: number;
}

const TOKEN_KEY = 'portfolio.admin.token';
const ADMIN_KEY = 'portfolio.admin.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly token = signal<string | null>(this.readStoredToken());
  readonly admin = signal<Admin | null>(this.readStoredAdmin());
  readonly isAuthenticated = computed(() => !!this.token());

  login(username: string, password: string): Observable<RawLoginResponse> {
    return this.http
      .post<RawLoginResponse>(`${environment.apiBaseUrl}/admin/login`, { username, password })
      .pipe(
        tap((res) => {
          if (res.success && res.token && res.data) {
            const admin: Admin = {
              _id: res.data._id,
              username: res.data.username,
              email: '',
              fullName: res.data.name,
              lastLoggedIn: res.data.lastLoggedIn ?? null,
            };
            this.storeAuth(res.token, admin);
          }
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    this.token.set(null);
    this.admin.set(null);
    void this.router.navigate(['/login']);
  }

  fetchMe(): Observable<ResponsePayload<Admin>> {
    return this.http.get<ResponsePayload<Admin>>(`${environment.apiBaseUrl}/admin/me`);
  }

  private storeAuth(token: string, admin: Admin): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    this.token.set(token);
    this.admin.set(admin);
  }

  private readStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private readStoredAdmin(): Admin | null {
    try {
      const raw = localStorage.getItem(ADMIN_KEY);
      return raw ? (JSON.parse(raw) as Admin) : null;
    } catch {
      return null;
    }
  }
}
