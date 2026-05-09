import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Experience } from '@portfolio/shared-types';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="experience" class="section">
      <div class="container">
        <span class="section-kicker">Experience</span>
        <h2 class="section-title">Where I've shipped</h2>
        <p class="section-subtitle">A timeline of places I've worked, projects I've led, and what I learned along the way.</p>

        @if (items.length === 0) {
          <p style="color: var(--text-3)">No experience entries yet.</p>
        } @else {
          <ol class="timeline">
            @for (e of items; track e._id || e.role + e.company) {
              <li class="row">
                <div class="period">
                  <span class="dot"></span>
                  <div>
                    <div class="period-text">{{ formatPeriod(e) }}</div>
                    @if (e.location) { <div class="period-loc">{{ e.location }}</div> }
                  </div>
                </div>
                <div class="card item">
                  <div class="head">
                    <div>
                      <h3>{{ e.role }}</h3>
                      <p class="company">
                        @if (e.companyUrl) {
                          <a [href]="e.companyUrl" target="_blank" rel="noopener">{{ e.company }}</a>
                        } @else { {{ e.company }} }
                        @if (e.type) { <span class="type">· {{ e.type }}</span> }
                      </p>
                    </div>
                    @if (e.companyLogo) {
                      <img class="logo" [src]="e.companyLogo" [alt]="e.company" />
                    }
                  </div>
                  @if (e.description) { <p class="desc">{{ e.description }}</p> }
                  @if ((e.achievements?.length ?? 0) > 0) {
                    <ul class="achievements">
                      @for (a of e.achievements; track a) { <li>{{ a }}</li> }
                    </ul>
                  }
                  @if ((e.techStack?.length ?? 0) > 0) {
                    <div class="stack">
                      @for (t of e.techStack; track t) { <span class="chip">{{ t }}</span> }
                    </div>
                  }
                </div>
              </li>
            }
          </ol>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .timeline { list-style: none; padding: 0; margin: 0; display: grid; gap: 1.5rem; }
      .row { display: grid; grid-template-columns: 200px 1fr; gap: 1.5rem; }
      .period { position: relative; padding-left: 1.25rem; padding-top: .25rem; }
      .period::before {
        content: ''; position: absolute; left: 6px; top: 24px; bottom: -2.5rem;
        width: 2px; background: linear-gradient(var(--accent-1), transparent);
      }
      .period .dot {
        position: absolute; left: 0; top: 6px; width: 14px; height: 14px;
        border-radius: 50%; background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
        box-shadow: 0 0 0 4px rgba(14,165,164,.18);
      }
      .period-text { font-weight: 700; color: var(--text-1); font-size: .875rem; }
      .period-loc { color: var(--text-3); font-size: .8125rem; margin-top: 2px; }
      .item .head { display: flex; align-items: start; justify-content: space-between; gap: 1rem; }
      .item h3 { font-family: var(--font-display); margin: 0 0 .25rem; }
      .company { color: var(--text-2); margin: 0; font-size: .9375rem; }
      .company a { color: var(--accent-1-dark); font-weight: 600; }
      .type { color: var(--text-3); font-size: .8125rem; }
      .logo { width: 44px; height: 44px; border-radius: 10px; object-fit: contain; background: var(--bg-soft); padding: 4px; }
      .desc { color: var(--text-2); margin: 1rem 0 .5rem; line-height: 1.6; }
      .achievements { margin: .5rem 0 0; padding-left: 1.25rem; color: var(--text-2); }
      .achievements li { margin-bottom: .25rem; line-height: 1.55; }
      .stack { display: flex; flex-wrap: wrap; gap: .375rem; margin-top: 1rem; }
      .stack .chip { background: var(--bg-soft); }
      @media (max-width: 880px) {
        .row { grid-template-columns: 1fr; }
        .period { padding-left: 0; }
        .period::before { display: none; }
        .period .dot { display: none; }
      }
    `,
  ],
})
export class ExperienceComponent {
  @Input() items: Experience[] = [];

  formatPeriod(e: Experience): string {
    const start = formatDateLabel(e.startDate);
    const end = e.current ? 'Present' : formatDateLabel(e.endDate);
    return `${start} — ${end}`;
  }
}

function formatDateLabel(value?: string): string {
  if (!value) return '';
  const m = value.match(/^(\d{4})-?(\d{2})?/);
  if (!m) return value;
  const year = m[1];
  const month = m[2];
  if (!month) return year;
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const idx = parseInt(month, 10) - 1;
  return `${monthNames[idx] ?? month} ${year}`;
}
