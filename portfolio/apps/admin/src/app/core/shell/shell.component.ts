import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth.service';

interface NavGroup {
  label: string;
  items: { label: string; route: string; icon: string }[];
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
    <div class="shell">
      <aside class="sidebar" [class.collapsed]="collapsed()">
        <div class="brand">
          <span class="logo">P</span>
          @if (!collapsed()) { <span class="brand-name">Portfolio Admin</span> }
        </div>
        <nav class="nav">
          @for (group of nav; track group.label) {
            <div class="nav-group">
              @if (!collapsed()) { <p class="nav-group-label">{{ group.label }}</p> }
              @for (item of group.items; track item.route) {
                <a
                  [routerLink]="item.route"
                  routerLinkActive="active"
                  class="nav-item"
                  [matTooltip]="collapsed() ? item.label : ''"
                  matTooltipPosition="right"
                >
                  <mat-icon>{{ item.icon }}</mat-icon>
                  @if (!collapsed()) { <span>{{ item.label }}</span> }
                </a>
              }
            </div>
          }
        </nav>
      </aside>

      <div class="main">
        <header class="topbar">
          <button mat-icon-button (click)="toggle()" aria-label="Toggle sidebar">
            <mat-icon>{{ collapsed() ? 'menu' : 'menu_open' }}</mat-icon>
          </button>
          <div class="spacer"></div>
          <div class="who">
            <span class="who-name">{{ admin()?.fullName || admin()?.username || 'Admin' }}</span>
            <button mat-icon-button (click)="logout()" matTooltip="Sign out">
              <mat-icon>logout</mat-icon>
            </button>
          </div>
        </header>
        <main class="outlet">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; height: 100vh; }
      .shell { display: grid; grid-template-columns: auto 1fr; height: 100vh; }
      .sidebar {
        background: #0f172a; color: #cbd5e1;
        width: 240px; transition: width .2s ease;
        display: flex; flex-direction: column;
        border-right: 1px solid rgba(255,255,255,0.06);
      }
      .sidebar.collapsed { width: 64px; }
      .brand {
        display: flex; align-items: center; gap: .75rem;
        padding: 1rem; height: 56px; box-sizing: border-box;
        color: #fff; font-weight: 700; font-size: 1rem;
      }
      .logo {
        width: 32px; height: 32px; border-radius: 8px;
        background: linear-gradient(135deg, #0ea5a4, #22c55e);
        display: grid; place-items: center; color: #fff; font-weight: 800;
      }
      .brand-name { white-space: nowrap; }
      .nav { flex: 1; overflow-y: auto; padding: .5rem; }
      .nav-group + .nav-group { margin-top: .75rem; }
      .nav-group-label {
        padding: .5rem .75rem; margin: 0; font-size: .75rem;
        text-transform: uppercase; letter-spacing: .04em; color: #64748b;
      }
      .nav-item {
        display: flex; align-items: center; gap: .75rem;
        padding: .5rem .75rem; border-radius: 8px;
        color: #cbd5e1; text-decoration: none; font-size: .9375rem;
        white-space: nowrap; overflow: hidden;
      }
      .nav-item mat-icon { color: #94a3b8; }
      .nav-item:hover { background: rgba(255,255,255,0.04); color: #fff; }
      .nav-item.active { background: rgba(14,165,164,0.18); color: #fff; }
      .nav-item.active mat-icon { color: #2dd4bf; }
      .main { display: flex; flex-direction: column; min-width: 0; }
      .topbar {
        height: 56px; padding: 0 1rem;
        display: flex; align-items: center; gap: .5rem;
        background: #fff; border-bottom: 1px solid rgba(15,23,42,0.08);
      }
      .spacer { flex: 1; }
      .who { display: flex; align-items: center; gap: .25rem; }
      .who-name { font-weight: 600; color: #475569; }
      .outlet { flex: 1; overflow-y: auto; }
    `,
  ],
})
export class ShellComponent {
  private readonly auth = inject(AuthService);

  readonly admin = this.auth.admin;
  readonly collapsed = signal(false);

  readonly nav: NavGroup[] = [
    {
      label: 'Overview',
      items: [{ label: 'Dashboard', route: '/dashboard', icon: 'dashboard' }],
    },
    {
      label: 'Site',
      items: [
        { label: 'Profile', route: '/profile', icon: 'person' },
        { label: 'Hero', route: '/hero', icon: 'flag' },
        { label: 'About', route: '/about', icon: 'info' },
        { label: 'Settings', route: '/settings', icon: 'settings' },
      ],
    },
    {
      label: 'Resume',
      items: [
        { label: 'Experience', route: '/experience', icon: 'work' },
        { label: 'Education', route: '/education', icon: 'school' },
        { label: 'Skills', route: '/skills', icon: 'tune' },
        { label: 'Certifications', route: '/certifications', icon: 'verified' },
        { label: 'Achievements', route: '/achievements', icon: 'emoji_events' },
      ],
    },
    {
      label: 'Work',
      items: [
        { label: 'Projects', route: '/projects', icon: 'collections_bookmark' },
        { label: 'Services', route: '/services', icon: 'design_services' },
        { label: 'Testimonials', route: '/testimonials', icon: 'format_quote' },
      ],
    },
    {
      label: 'Inbox',
      items: [{ label: 'Messages', route: '/messages', icon: 'mail' }],
    },
    {
      label: 'Danger',
      items: [{ label: 'Reset Data', route: '/danger-zone', icon: 'warning' }],
    },
  ];

  toggle(): void {
    this.collapsed.update((v) => !v);
  }

  logout(): void {
    this.auth.logout();
  }
}
