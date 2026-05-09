import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Profile, SiteSettings } from '@portfolio/shared-types';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div>
            <a href="#top" class="brand">
              <span class="brand-mark">{{ initials() }}</span>
              <span>{{ profile?.shortName || profile?.fullName || 'Portfolio' }}</span>
            </a>
            <p class="copy">{{ copyright() }}</p>
          </div>

          @if (showSocials() && (profile?.socials?.length ?? 0) > 0) {
            <div class="socials">
              @for (s of profile?.socials; track s.url) {
                <a [href]="s.url" target="_blank" rel="noopener">{{ s.label }}</a>
              }
            </div>
          }
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer { padding: 2.5rem 0; border-top: 1px solid var(--border); background: var(--bg); }
      .row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
      .brand { display: flex; align-items: center; gap: .625rem; font-weight: 700; }
      .brand-mark {
        width: 32px; height: 32px; border-radius: 8px;
        background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
        color: #fff; display: grid; place-items: center; font-weight: 800;
      }
      .copy { color: var(--text-3); font-size: .875rem; margin: .5rem 0 0; }
      .socials { display: flex; gap: 1.25rem; flex-wrap: wrap; }
      .socials a { color: var(--text-2); font-weight: 500; }
      .socials a:hover { color: var(--accent-1-dark); }
    `,
  ],
})
export class FooterComponent {
  @Input() profile: Profile | null = null;
  @Input() settings: SiteSettings | null = null;

  initials(): string {
    const name = this.profile?.shortName || this.profile?.fullName || 'P';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'P';
  }

  copyright(): string {
    return (
      this.settings?.footer?.copyright ??
      `© ${new Date().getFullYear()} ${this.profile?.fullName ?? 'All rights reserved.'}`
    );
  }

  showSocials(): boolean {
    return this.settings?.footer?.showSocials ?? true;
  }
}
