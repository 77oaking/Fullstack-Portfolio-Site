import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AboutSection, Profile } from '@portfolio/shared-types';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="section about">
      <div class="container">
        <div class="grid">
          <div class="text">
            @if (about?.kicker) { <span class="section-kicker">{{ about?.kicker }}</span> }
            <h2 class="section-title">{{ about?.heading || 'About me' }}</h2>
            @for (p of paragraphs(); track $index) { <p>{{ p }}</p> }

            @if ((about?.values?.length ?? 0) > 0) {
              <div class="values">
                @for (v of about?.values; track v) { <span class="chip">{{ v }}</span> }
              </div>
            }
          </div>

          <aside class="facts">
            @if (about?.imageUrl) {
              <img class="about-image" [src]="about?.imageUrl" alt="" />
            }
            @if ((about?.facts?.length ?? 0) > 0) {
              <div class="card facts-card">
                <h3>Quick facts</h3>
                <dl>
                  @for (f of about?.facts; track f.label) {
                    <dt>{{ f.label }}</dt>
                    <dd>{{ f.value }}</dd>
                  }
                </dl>
              </div>
            }
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .about { background: var(--bg-alt); }
      .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; align-items: start; }
      .text p { color: var(--text-2); margin: 0 0 1rem; max-width: 64ch; line-height: 1.7; }
      .values { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.5rem; }
      .values .chip { background: var(--accent-soft); color: var(--accent-1-dark); font-weight: 600; }
      .facts-card { padding: 1.5rem; }
      .facts-card h3 { margin: 0 0 1rem; font-family: var(--font-display); }
      .facts-card dl { display: grid; grid-template-columns: max-content 1fr; gap: .5rem 1rem; margin: 0; }
      .facts-card dt { color: var(--text-3); font-weight: 600; font-size: .875rem; }
      .facts-card dd { color: var(--text-1); margin: 0; }
      .about-image { width: 100%; border-radius: var(--radius-lg); margin-bottom: 1rem; box-shadow: var(--shadow-md); }
      @media (max-width: 880px) { .grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AboutComponent {
  @Input() about: AboutSection | null = null;
  @Input() profile: Profile | null = null;

  paragraphs(): string[] {
    const fromAbout = this.about?.paragraphs ?? [];
    if (fromAbout.length > 0) return fromAbout;
    return this.profile?.bio ? [this.profile.bio] : [];
  }
}
