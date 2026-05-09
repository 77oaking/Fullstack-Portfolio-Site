import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Service } from '@portfolio/shared-types';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="services" class="section services">
      <div class="container">
        <span class="section-kicker">Services</span>
        <h2 class="section-title">Ways I can help</h2>
        <p class="section-subtitle">Pick the engagement that fits — or get in touch if you want something custom.</p>

        @if (items.length === 0) {
          <p style="color: var(--text-3)">No services configured yet.</p>
        } @else {
          <div class="grid">
            @for (s of items; track s._id || s.title) {
              <article class="card service">
                @if (s.icon) {
                  <div class="icon">{{ s.icon }}</div>
                } @else {
                  <div class="icon icon-default">●</div>
                }
                <h3>{{ s.title }}</h3>
                <p class="desc">{{ s.description }}</p>
                @if ((s.features?.length ?? 0) > 0) {
                  <ul>
                    @for (f of s.features; track f) {
                      <li><span class="check">✓</span> {{ f }}</li>
                    }
                  </ul>
                }
              </article>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .services { background: var(--bg-alt); }
      .grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
      .service { transition: transform .2s ease, box-shadow .2s ease; }
      .service:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
      .icon {
        width: 48px; height: 48px; border-radius: 14px;
        background: linear-gradient(135deg, var(--accent-soft), #fff);
        color: var(--accent-1-dark); display: grid; place-items: center;
        font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;
      }
      .icon-default { color: var(--accent-1); font-size: 2rem; }
      h3 { font-family: var(--font-display); margin: 0 0 .5rem; }
      .desc { color: var(--text-2); line-height: 1.55; margin: 0 0 1rem; }
      ul { list-style: none; margin: 0; padding: 0; display: grid; gap: .5rem; color: var(--text-2); }
      li { display: flex; align-items: start; gap: .5rem; }
      .check {
        color: var(--accent-1); font-weight: 800; flex-shrink: 0;
      }
    `,
  ],
})
export class ServicesComponent {
  @Input() items: Service[] = [];
}
