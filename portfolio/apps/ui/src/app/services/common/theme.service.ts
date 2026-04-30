import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  applyTheme,
  forgetStoredTheme,
  loadStoredTheme,
  rememberTheme,
} from '@portfolio/theme-engine';
import type { ResponsePayload, Theme } from '@portfolio/shared-types';

const ACTIVE_URL = `${environment.apiBaseLink}/api/v1/themes/active`;
const LIST_URL = `${environment.apiBaseLink}/api/v1/themes`;
const BY_ID_URL = (id: string) => `${environment.apiBaseLink}/api/v1/themes/by-id/${id}`;

/**
 * Bridges the API + theme-engine + Angular runtime.
 *
 *  - On bootstrap, fetches whichever theme should render right now and applies
 *    it before the first paint (registered as APP_INITIALIZER).
 *  - Public `setTheme(id)` lets the user pick a theme; persists to localStorage
 *    so the choice survives reloads.
 *  - `current$` is observable for components that want to react to switches.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _current$ = new BehaviorSubject<Theme | null>(null);
  readonly current$ = this._current$.asObservable();

  constructor(private readonly http: HttpClient) {}

  get current(): Theme | null {
    return this._current$.value;
  }

  /** Called from APP_INITIALIZER. Resolve = ready to render. */
  async bootstrap(): Promise<void> {
    const storedId = loadStoredTheme();
    try {
      const theme = storedId
        ? await this.fetchById(storedId).catch(() => this.fetchActive())
        : await this.fetchActive();
      this.set(theme);
    } catch (err) {
      console.warn('[ThemeService] Could not load theme; using fallback CSS vars.', err);
    }
  }

  /** List visible themes — for the public theme switcher (if you add one). */
  async list(): Promise<Theme[]> {
    const res = await firstValueFrom(this.http.get<ResponsePayload<Theme[]>>(LIST_URL));
    return res.data ?? [];
  }

  async setById(themeId: string): Promise<void> {
    const theme = await this.fetchById(themeId);
    this.set(theme);
    rememberTheme(themeId);
  }

  /** Forget the user's choice and revert to whatever the server marks active. */
  async resetToServerDefault(): Promise<void> {
    forgetStoredTheme();
    const theme = await this.fetchActive();
    this.set(theme);
  }

  // ---- internal --------------------------------------------------------

  private set(theme: Theme): void {
    applyTheme(theme);
    this._current$.next(theme);
  }

  private async fetchActive(): Promise<Theme> {
    const res = await firstValueFrom(this.http.get<ResponsePayload<Theme>>(ACTIVE_URL));
    if (!res.data) throw new Error('No active theme returned');
    return res.data;
  }

  private async fetchById(themeId: string): Promise<Theme> {
    const res = await firstValueFrom(this.http.get<ResponsePayload<Theme>>(BY_ID_URL(themeId)));
    if (!res.data) throw new Error(`Theme '${themeId}' not found`);
    return res.data;
  }
}
