import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import type { PortfolioBundle } from '@portfolio/shared-types';

import { PortfolioBundleService } from '../../services/portfolio-resources';

interface MetricCard {
  label: string;
  value: number | string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Welcome back</h1>
          <p class="page-subtitle">Snapshot of what's currently in your portfolio.</p>
        </div>
      </div>

      <div class="grid">
        @for (m of metrics(); track m.label) {
          <a [routerLink]="m.route ?? null" class="metric-card">
            <mat-icon>{{ m.icon }}</mat-icon>
            <div>
              <p class="metric-value">{{ m.value }}</p>
              <p class="metric-label">{{ m.label }}</p>
            </div>
          </a>
        }
      </div>

      @if (bundle()) {
        <div class="card">
          <h2 style="margin-top:0">Quick links</h2>
          <p>Use the sidebar to fill in every section. Start with <a routerLink="/profile">Profile</a>, then <a routerLink="/hero">Hero</a> and <a routerLink="/about">About</a>.</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .grid {
        display: grid; gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        margin-bottom: 1.5rem;
      }
      .metric-card {
        display: flex; align-items: center; gap: 1rem;
        padding: 1.25rem; background: var(--surface);
        border: 1px solid var(--border); border-radius: var(--radius-lg);
        text-decoration: none; color: var(--text-1);
        transition: transform .15s ease, box-shadow .15s ease;
      }
      .metric-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
      .metric-card mat-icon {
        background: var(--accent-soft); color: var(--accent-1);
        padding: 8px; border-radius: 12px; width: 40px; height: 40px;
        font-size: 24px; display: grid; place-items: center;
      }
      .metric-value { font-size: 1.75rem; font-weight: 700; margin: 0; line-height: 1; }
      .metric-label { color: var(--text-2); margin: .25rem 0 0; font-size: .9375rem; }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(PortfolioBundleService);

  readonly bundle = signal<PortfolioBundle | null>(null);
  readonly metrics = signal<MetricCard[]>([]);

  ngOnInit(): void {
    this.api.bundle().subscribe((res) => {
      const b = res.data ?? null;
      this.bundle.set(b);
      if (b) {
        this.metrics.set([
          { label: 'Experience', value: b.experiences.length, icon: 'work', route: '/experience' },
          { label: 'Education', value: b.educations.length, icon: 'school', route: '/education' },
          { label: 'Skill categories', value: b.skillCategories.length, icon: 'tune', route: '/skills' },
          { label: 'Projects', value: b.projects.length, icon: 'collections_bookmark', route: '/projects' },
          { label: 'Services', value: b.services.length, icon: 'design_services', route: '/services' },
          { label: 'Testimonials', value: b.testimonials.length, icon: 'format_quote', route: '/testimonials' },
          { label: 'Certifications', value: b.certifications.length, icon: 'verified', route: '/certifications' },
          { label: 'Achievements', value: b.achievements.length, icon: 'emoji_events', route: '/achievements' },
        ]);
      }
    });
  }
}
