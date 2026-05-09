import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Project } from '@portfolio/shared-types';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="projects" class="section">
      <div class="container">
        <span class="section-kicker">Projects</span>
        <h2 class="section-title">Selected work</h2>
        <p class="section-subtitle">Things I shipped, ranging from full products to focused experiments.</p>

        @if (items.length === 0) {
          <p style="color: var(--text-3)">No projects yet.</p>
        } @else {
          <div class="grid">
            @for (p of items; track p._id || p.slug) {
              <article class="card project" [class.featured]="p.featured">
                <div class="cover" [class.no-image]="!p.coverImage">
                  @if (p.coverImage) {
                    <img [src]="p.coverImage" [alt]="p.title" />
                  } @else {
                    <div class="placeholder"><span>{{ initial(p.title) }}</span></div>
                  }
                  @if (p.featured) { <span class="badge-featured">Featured</span> }
                </div>
                <div class="body">
                  @if (p.category) { <span class="cat-chip">{{ p.category }}</span> }
                  <h3>{{ p.title }}</h3>
                  <p class="summary">{{ p.summary }}</p>
                  @if ((p.techStack?.length ?? 0) > 0) {
                    <div class="stack">
                      @for (t of p.techStack; track t) { <span class="chip">{{ t }}</span> }
                    </div>
                  }
                  <div class="links">
                    @if (p.liveUrl) {
                      <a class="link" [href]="p.liveUrl" target="_blank" rel="noopener">Live ↗</a>
                    }
                    @if (p.repoUrl) {
                      <a class="link" [href]="p.repoUrl" target="_blank" rel="noopener">Code ↗</a>
                    }
                    @if (p.caseStudyUrl) {
                      <a class="link" [href]="p.caseStudyUrl" target="_blank" rel="noopener">Case study ↗</a>
                    }
                  </div>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
      .project { padding: 0; overflow: hidden; transition: transform .2s ease, box-shadow .2s ease; }
      .project:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
      .project.featured { border-color: rgba(14,165,164,0.3); }
      .cover { position: relative; aspect-ratio: 16 / 9; background: var(--bg-soft); overflow: hidden; }
      .cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
      .project:hover .cover img { transform: scale(1.04); }
      .placeholder {
        width: 100%; height: 100%;
        background: linear-gradient(135deg, var(--accent-soft), #fff);
        display: grid; place-items: center;
      }
      .placeholder span {
        font-family: var(--font-display); font-weight: 800; font-size: 4rem;
        color: var(--accent-1);
      }
      .badge-featured {
        position: absolute; top: .75rem; left: .75rem;
        background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
        color: #fff; padding: .25rem .625rem; border-radius: var(--radius-pill);
        font-size: .75rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
      }
      .body { padding: 1.25rem; }
      .cat-chip { display: inline-block; font-size: .75rem; font-weight: 600;
        color: var(--accent-1-dark); margin-bottom: .5rem; text-transform: uppercase; letter-spacing: .06em; }
      h3 { font-family: var(--font-display); margin: 0 0 .5rem; }
      .summary { color: var(--text-2); margin: 0 0 1rem; line-height: 1.55; }
      .stack { display: flex; flex-wrap: wrap; gap: .375rem; margin-bottom: 1rem; }
      .links { display: flex; gap: 1rem; }
      .link {
        font-weight: 600; color: var(--accent-1-dark); position: relative; padding-bottom: 2px;
        background: linear-gradient(var(--accent-1), var(--accent-1)) bottom left/0 1px no-repeat;
        transition: background-size .2s ease;
      }
      .link:hover { background-size: 100% 1px; }
    `,
  ],
})
export class ProjectsComponent {
  @Input() items: Project[] = [];

  initial(t: string): string {
    return (t ?? '').trim().charAt(0).toUpperCase() || 'P';
  }
}
