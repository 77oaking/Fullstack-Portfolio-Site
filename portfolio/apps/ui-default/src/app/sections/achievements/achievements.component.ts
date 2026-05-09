import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Achievement } from '@portfolio/shared-types';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="achievements" class="section">
      <div class="container">
        <span class="section-kicker">Achievements</span>
        <h2 class="section-title">Highlights</h2>
        <p class="section-subtitle">Awards, milestones, and noteworthy mentions.</p>

        @if (items.length === 0) {
          <p style="color: var(--text-3)">No achievements yet.</p>
        } @else {
          <ul class="list">
            @for (a of items; track a._id || a.title) {
              <li class="card achievement">
                <div class="icon">{{ a.icon || '★' }}</div>
                <div class="body">
                  <h3>{{ a.title }}</h3>
                  @if (a.date) { <p class="date">{{ a.date }}</p> }
                  @if (a.description) { <p class="desc">{{ a.description }}</p> }
                  @if (a.link) {
                    <a [href]="a.link" target="_blank" rel="noopener" class="link">Learn more ↗</a>
                  }
                </div>
              </li>
            }
          </ul>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .list { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
      .achievement { display: flex; gap: 1rem; align-items: flex-start; }
      .icon {
        width: 48px; height: 48px; border-radius: 14px;
        background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
        color: #fff; display: grid; place-items: center; font-size: 1.5rem; flex-shrink: 0;
      }
      h3 { font-family: var(--font-display); margin: 0 0 .25rem; }
      .date { color: var(--text-3); font-size: .8125rem; margin: 0 0 .5rem; }
      .desc { color: var(--text-2); margin: 0 0 .5rem; }
      .link { color: var(--accent-1-dark); font-weight: 600; font-size: .9375rem; }
    `,
  ],
})
export class AchievementsComponent {
  @Input() items: Achievement[] = [];
}
