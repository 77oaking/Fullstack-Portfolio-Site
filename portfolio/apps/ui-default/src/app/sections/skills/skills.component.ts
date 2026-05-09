import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { SkillCategory } from '@portfolio/shared-types';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="skills" class="section skills">
      <div class="container">
        <span class="section-kicker">Skills</span>
        <h2 class="section-title">Tools I reach for</h2>
        <p class="section-subtitle">Grouped roughly by where they sit in the stack.</p>

        @if (categories.length === 0) {
          <p style="color: var(--text-3)">No skills configured yet.</p>
        } @else {
          <div class="grid">
            @for (cat of categories; track cat._id || cat.name) {
              <article class="card cat">
                <header>
                  @if (cat.icon) { <span class="icon">{{ cat.icon }}</span> }
                  <h3>{{ cat.name }}</h3>
                </header>
                @if (cat.description) { <p class="cat-desc">{{ cat.description }}</p> }
                <ul>
                  @for (s of cat.items; track s.name) {
                    <li>
                      <div class="row">
                        <span class="name">{{ s.name }}</span>
                        @if (s.yearsOfExperience) {
                          <span class="years">{{ s.yearsOfExperience }}y</span>
                        }
                      </div>
                      @if (s.level !== undefined && s.level !== null) {
                        <div class="bar"><span [style.width.%]="clamp(s.level)"></span></div>
                      }
                    </li>
                  }
                </ul>
              </article>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .skills { background: var(--bg-alt); }
      .grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
      .cat { display: flex; flex-direction: column; }
      .cat header { display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; }
      .cat .icon {
        width: 32px; height: 32px; border-radius: 8px;
        background: var(--accent-soft); color: var(--accent-1-dark);
        display: grid; place-items: center; font-weight: 700;
      }
      .cat h3 { font-family: var(--font-display); margin: 0; }
      .cat-desc { color: var(--text-2); margin: 0 0 1rem; font-size: .9375rem; }
      ul { list-style: none; margin: 0; padding: 0; display: grid; gap: .75rem; }
      .row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: .25rem; }
      .name { font-weight: 600; color: var(--text-1); }
      .years { font-size: .8125rem; color: var(--text-3); }
      .bar {
        height: 6px; background: var(--bg-soft); border-radius: 999px; overflow: hidden;
      }
      .bar span {
        display: block; height: 100%;
        background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
        border-radius: 999px;
        transition: width .6s ease;
      }
    `,
  ],
})
export class SkillsComponent {
  @Input() categories: SkillCategory[] = [];

  clamp(v: number | undefined | null): number {
    if (v == null) return 0;
    return Math.max(0, Math.min(100, v));
  }
}
