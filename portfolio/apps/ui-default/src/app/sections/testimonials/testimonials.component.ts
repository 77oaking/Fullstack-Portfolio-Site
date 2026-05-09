import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Testimonial } from '@portfolio/shared-types';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="testimonials" class="section">
      <div class="container">
        <span class="section-kicker">Words</span>
        <h2 class="section-title">Kind things people have said</h2>
        <p class="section-subtitle">Notes from clients and teammates.</p>

        @if (items.length === 0) {
          <p style="color: var(--text-3)">No testimonials yet.</p>
        } @else {
          <div class="grid">
            @for (t of items; track t._id || t.name) {
              <blockquote class="card t">
                <span class="quote-mark">"</span>
                <p class="quote">{{ t.quote }}</p>
                <footer>
                  @if (t.avatarUrl) {
                    <img class="avatar" [src]="t.avatarUrl" [alt]="t.name" />
                  } @else {
                    <div class="avatar avatar-fallback">{{ initial(t.name) }}</div>
                  }
                  <div>
                    <div class="name">{{ t.name }}</div>
                    <div class="role">{{ t.role }}{{ t.company ? ' · ' + t.company : '' }}</div>
                  </div>
                  @if (t.rating) {
                    <div class="rating">
                      @for (i of stars(t.rating); track i) { <span>★</span> }
                    </div>
                  }
                </footer>
              </blockquote>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
      .t { position: relative; padding: 1.75rem 1.5rem 1.5rem; }
      .quote-mark {
        position: absolute; top: -.25rem; left: 1rem; font-size: 4rem; line-height: 1;
        color: var(--accent-1); opacity: .25; font-family: var(--font-display);
      }
      .quote { color: var(--text-1); font-size: 1.0625rem; line-height: 1.6; margin: 0 0 1.25rem; }
      footer { display: flex; align-items: center; gap: .75rem; }
      .avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
      .avatar-fallback {
        background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
        color: #fff; font-weight: 700; display: grid; place-items: center;
      }
      .name { font-weight: 600; }
      .role { color: var(--text-3); font-size: .875rem; }
      .rating { margin-left: auto; color: #f59e0b; letter-spacing: .04em; }
    `,
  ],
})
export class TestimonialsComponent {
  @Input() items: Testimonial[] = [];

  initial(s: string): string { return (s ?? '').trim().charAt(0).toUpperCase() || 'T'; }
  stars(n: number): number[] {
    return Array.from({ length: Math.max(0, Math.min(5, Math.round(n))) });
  }
}
