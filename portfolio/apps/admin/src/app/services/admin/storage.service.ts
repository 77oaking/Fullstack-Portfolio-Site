import { Injectable } from '@angular/core';

const TOKEN_KEY = 'portfolio.admin.token';
const PROFILE_KEY = 'portfolio.admin.profile';
const TOKEN_EXPIRY_KEY = 'portfolio.admin.tokenExpiresAt';

export interface StoredAdminProfile {
  _id: string;
  username: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  setToken(token: string, expiresInSec: number): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresInSec * 1000));
    } catch {
      // ignore (private mode, quota, etc.)
    }
  }

  getToken(): string | null {
    if (this.isTokenExpired()) {
      this.clear();
      return null;
    }
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setProfile(profile: StoredAdminProfile): void {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      /* ignore */
    }
  }

  getProfile(): StoredAdminProfile | null {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? (JSON.parse(raw) as StoredAdminProfile) : null;
    } catch {
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch {
      /* ignore */
    }
  }

  private isTokenExpired(): boolean {
    try {
      const exp = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (!exp) return false;
      return Date.now() > parseInt(exp, 10);
    } catch {
      return false;
    }
  }
}
