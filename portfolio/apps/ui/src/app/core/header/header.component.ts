import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ThemeService } from '../../services/common/theme.service';
import { SettingsService } from '../../services/common/settings.service';
import type { Settings, Theme } from '@portfolio/shared-types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  themes: Theme[] = [];
  settings$!: Observable<Settings>;

  constructor(
    private readonly themeService: ThemeService,
    private readonly settingsService: SettingsService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.settings$ = this.settingsService.get();
    try {
      this.themes = await this.themeService.list();
    } catch {
      this.themes = [];
    }
  }

  get currentThemeId(): string | null {
    return this.themeService.current?.id ?? null;
  }

  switchTo(themeId: string): void {
    void this.themeService.setById(themeId);
  }
}
