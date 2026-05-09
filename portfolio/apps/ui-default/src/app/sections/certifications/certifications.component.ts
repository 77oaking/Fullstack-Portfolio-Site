import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Certification } from '@portfolio/shared-types';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="certifications" class="section certifications">
      <div class="container">
        <span class="section-kicker">Certifications</span>
        <h2 class="section-title">Verified credentials</h2>
        <p class="section-subtitle">Things I've earned along the way.</p>

        @if (items.length === 0) {
          <p style="color: var(--text-3)">No certifications yet.</p>
        } @else {
          <div class="grid">
            @for (c of items; track c._id || c.title) {
              <article class="card cert">
                @if (c.imageUrl) {
                  <img class="cert-image" [src]="c.imageUrl" [alt]="c.title" />
                } @else {
                  <div class="cert-image placeholder">✓</div>
                }
                <h3>{{ c.title }}</h3>
                <p class="issuer">{{ c.issuer }}</p>
                <p class="dates">
                  Issued {{ c.issueDate }}
                  @if (c.expiryDate) { · Expires {{ c.expiryDate }} }
                </p>
                @if (c.credentialUrl) {
                  <a [href]="c.credentialUrl" target="_blank" rel="noopener" class="link">View credential ↗</a>
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
      .certifications { background: var(--bg-alt); }
      .grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
      .cert { display: flex; flex-direction: column; }
      .cert-image {
        aspect-ratio: 4 / 3; width: 100%; object-fit: contain; background: var(--bg-soft);
        border-radius: var(--radius); margin-bottom: 1rem;
      }
      .placeholder {
        display: grid; place-items: center;
        background: linear-gradient(135deg, var(--accent-soft), #fff);
        color: var(--accent-1); font-size: 3rem; font-weight: 800;
      }
      h3 { font-family: var(--font-display); margin: 0 0 .25rem; }
      .issuer { color: var(--text-2); margin: 0 0 .5rem; font-weight: 500; }
      .dates { color: var(--text-3); font-size: .875rem; margin: 0 0 .75rem; }
      .link { color: var(--accent-1-dark); font-weight: 600; }
    `,
  ],
})
export class CertificationsComponent {
  @Input() items: Certification[] = [];
}
