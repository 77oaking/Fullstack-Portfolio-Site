import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { NavItem, Profile, SiteSettings } from '@portfolio/shared-types';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header" [class.scrolled]="scrolled()">
      <div class="container header-row">
        <a class="brand" href="#top">
          <span class="brand-mark">{{ initials() }}</span>
          <span class="brand-name">{{ profile?.shortName || profile?.fullName || 'Portfolio' }}</span>
        </a>
        <nav class="nav">
          @for (item of navItems(); track item.href) {
            <a [href]="item.href" [target]="item.external ? '_blank' : '_self'">{{ item.label }}</a>
          }
        </nav>
        <a class="btn btn-primary header-cta" href="#contact">Hire me</a>
        <button class="menu-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      @if (open()) {
        <div class="mobile-menu">
          @for (item of navItems(); track item.href) {
            <a [href]="item.href" (click)="open.set(false)">{{ item.label }}</a>
          }
          <a class="btn btn-primary" href="#contact" (click)="open.set(false)">Hire me</a>
        </div>
      }
    </header>
  `,
  styles: [
    `
      :host { display: block; position: sticky; top: 0; z-index: 50; }
      .header {
        background: var(--nav-bg);
        backdrop-filter: saturate(180%) blur(12px);
        -webkit-backdrop-filter: saturate(180%) blur(12px);
        border-bottom: 1px solid transparent;
        transition: border-color .2s ease, background .2s ease;
      }
      .header.scrolled { border-bottom-color: var(--border); }
      .header-row {
        display: flex; align-items: center; gap: 1.5rem;
        height: 72px;
      }
      .brand { display: flex; align-items: center; gap: .625rem; font-weight: 700; }
      .brand-mark {
        width: 36px; height: 36px; border-radius: 10px;
        background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
        color: #fff; display: grid; place-items: center; font-weight: 800;
      }
      .brand-name { font-family: var(--font-display); font-weight: 700; letter-spacing: -0.01em; }
      .nav { display: flex; gap: 1.5rem; margin-left: auto; }
      .nav a {
        color: var(--text-2); font-weight: 500; font-size: 0.9375rem;
        position: relative; padding: .25rem 0;
      }
      .nav a:hover { color: var(--text-1); }
      .nav a:hover::after {
        content: ''; position: absolute; left: 0; right: 0; bottom: -4px;
        height: 2px; background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
      }
      .header-cta { height: 40px; padding: 0 1.25rem; font-size: .875rem; }
      .menu-toggle {
        display: none; background: none; border: 0; padding: .5rem;
        flex-direction: column; gap: 4px; cursor: pointer;
      }
      .menu-toggle span { width: 22px; height: 2px; background: var(--text-1); }
      .mobile-menu {
        display: none; flex-direction: column; gap: .75rem;
        padding: 1rem 1.5rem 1.5rem; background: var(--bg);
        border-bottom: 1px solid var(--border);
      }
      .mobile-menu a { color: var(--text-1); font-weight: 600; font-size: 1rem; }
      @media (max-width: 880px) {
        .nav, .header-cta { display: none; }
        .menu-toggle { display: flex; margin-left: auto; }
        .mobile-menu { display: flex; }
      }
    `,
  ],
})
export class HeaderComponent {
  @Input() profile: Profile | null = null;
  @Input() settings: SiteSettings | null = null;

  readonly open = signal(false);
  readonly scrolled = signal(false);

  toggleMenu(): void { this.open.update((v) => !v); }

  navItems(): NavItem[] {
    const items = (this.settings?.navItems ?? []).slice().sort((a, b) => a.order - b.order);
    return items.length > 0
      ? items
      : [
          { label: 'About', href: '#about', order: 0 },
          { label: 'Experience', href: '#experience', order: 1 },
          { label: 'Skills', href: '#skills', order: 2 },
          { label: 'Projects', href: '#projects', order: 3 },
          { label: 'Education', href: '#education', order: 4 },
          { label: 'Contact', href: '#contact', order: 5 },
        ];
  }

  initials(): string {
    const name = this.profile?.shortName || this.profile?.fullName || 'P';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'P';
  }
}
