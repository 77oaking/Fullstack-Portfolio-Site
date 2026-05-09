import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Education } from '@portfolio/shared-types';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="education" class="section">
      <div class="container">
        <span class="section-kicker">Education</span>
        <h2 class="section-title">Where I learned</h2>
        <p class="section-subtitle">Formal study and the things it taught me.</p>

        @if (items.length === 0) {
          <p style="color: var(--text-3)">No education entries yet.</p>
        } @else {
          <div class="grid">
            @for (e of items; track e._id || e.institution + e.degree) {
              <article class="card item">
                <div class="head">
                  @if (e.institutionLogo) {
                    <img class="logo" [src]="e.institutionLogo" [alt]="e.institution" />
                  } @else {
                    <div class="logo placeholder">{{ initial(e.institution) }}</div>
                  }
                  <div>
                    <h3>{{ e.degree }}{{ e.fieldOfStudy ? ' · ' + e.fieldOfStudy : '' }}</h3>
                    <p class="institution">
                      @if (e.institutionUrl) {
                        <a [href]="e.institutionUrl" target="_blank" rel="noopener">{{ e.institution }}</a>
                      } @else { {{ e.institution }} }
                    </p>
                  </div>
                </div>
                <div class="meta">
                  <span>{{ e.startDate }} — {{ e.current ? 'Present' : (e.endDate || '') }}</span>
                  @if (e.location) { <span>· {{ e.location }}</span> }
                  @if (e.gpa) { <span>· {{ e.gpa }}</span> }
                </div>
                @if (e.description) { <p class="desc">{{ e.description }}</p> }
                @if ((e.achievements?.length ?? 0) > 0) {
                  <ul class="achievements">
                    @for (a of e.achievements; track a) { <li>{{ a }}</li> }
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
      .grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
      .item .head { display: flex; align-items: center; gap: .875rem; margin-bottom: .75rem; }
      .logo {
        width: 56px; height: 56px; border-radius: 12px; object-fit: contain;
        background: var(--bg-soft); padding: 6px;
      }
      .logo.placeholder {
        display: grid; place-items: center; padding: 0;
        background: linear-gradient(135deg, var(--accent-soft), #fff);
        color: var(--accent-1-dark); font-weight: 800;
        font-family: var(--font-display); font-size: 1.25rem;
      }
      h3 { margin: 0 0 .125rem; font-family: var(--font-display); }
      .institution { margin: 0; color: var(--text-2); }
      .institution a { color: var(--accent-1-dark); font-weight: 600; }
      .meta { color: var(--text-3); font-size: .875rem; margin-bottom: .5rem; display: flex; gap: .375rem; flex-wrap: wrap; }
      .desc { color: var(--text-2); margin: .5rem 0; line-height: 1.6; }
      .achievements { margin: .5rem 0 0; padding-left: 1.25rem; color: var(--text-2); font-size: .9375rem; }
    `,
  ],
})
export class EducationComponent {
  @Input() items: Education[] = [];

  initial(s: string): string {
    return (s ?? '').trim().charAt(0).toUpperCase() || 'E';
  }
}
