import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ThemeService } from '../../../services/common/theme.service';
import { UiService } from '../../../services/common/ui.service';
import { applyTheme } from '@portfolio/theme-engine';
import type { Theme } from '@portfolio/shared-types';

@Component({
  selector: 'app-themes-list',
  templateUrl: './themes-list.component.html',
  styleUrls: ['./themes-list.component.scss'],
})
export class ThemesListComponent implements OnInit {
  themes: Theme[] = [];
  active: Theme | null = null;
  selectedTheme: Theme | null = null;
  loading = false;

  @ViewChild('previewSection', { static: true }) previewEl!: ElementRef<HTMLElement>;

  constructor(private readonly service: ThemeService, private readonly ui: UiService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.service.list().subscribe({
      next: (r) => {
        this.themes = r.data ?? [];
        this.loading = false;
        if (this.themes.length) this.preview(this.themes[0]);
      },
      error: () => {
        this.loading = false;
        this.ui.error('Failed to load themes');
      },
    });
    this.service.active().subscribe({
      next: (r) => (this.active = r.data ?? null),
    });
  }

  preview(theme: Theme): void {
    this.selectedTheme = theme;
    if (this.previewEl?.nativeElement) {
      applyTheme(theme, this.previewEl.nativeElement);
    }
  }

  activate(theme: Theme): void {
    this.service.activate(theme.id).subscribe({
      next: () => {
        this.ui.success(`Activated '${theme.name}'`);
        this.active = theme;
      },
      error: (err) => this.ui.error(err?.error?.message ?? 'Activate failed'),
    });
  }

  isActive(t: Theme): boolean {
    return this.active?.id === t.id;
  }
}
