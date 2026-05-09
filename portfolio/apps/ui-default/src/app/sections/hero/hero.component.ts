import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { HeroSection, Profile } from '@portfolio/shared-types';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="top" class="hero">
      <div class="bg-gradient"></div>
      <div class="container hero-grid">
        <div class="hero-text">
          @if (hero?.badge) {
            <span class="badge">
              <span class="dot"></span>
              {{ hero?.badge }}
            </span>
          }
          <h1>
            {{ hero?.headline || 'Hi, I' + apos + 'm ' + (profile?.shortName || profile?.fullName || 'a developer') + '.' }}
          </h1>
          <p class="subhead">
            {{ hero?.subhead || profile?.shortBio || 'I build full-stack web products end-to-end.' }}
          </p>

          <div class="ctas">
            <a class="btn btn-primary" [href]="hero?.primaryCtaUrl || '#contact'">
              {{ hero?.primaryCtaLabel || 'Get in touch' }}
            </a>
            @if (hero?.secondaryCtaLabel) {
              <a class="btn btn-secondary" [href]="hero?.secondaryCtaUrl || '#projects'">
                {{ hero?.secondaryCtaLabel }}
              </a>
            }
          </div>

          @if ((hero?.metrics?.length ?? 0) > 0) {
            <div class="metrics">
              @for (m of hero?.metrics; track m.label) {
                <div class="metric">
                  <div class="metric-value">{{ m.value }}</div>
                  <div class="metric-label">{{ m.label }}</div>
                </div>
              }
            </div>
          }
        </div>

        <div class="hero-visual">
          <div class="avatar">
            @if (profile?.avatarUrl) {
              <img [src]="profile?.avatarUrl" [alt]="profile?.fullName || 'avatar'" />
            } @else {
              <span class="avatar-fallback">{{ initials() }}</span>
            }
          </div>
          <div class="orbit-1"></div>
          <div class="orbit-2"></div>
        </div>
      </div>

      @if ((hero?.techMarquee?.length ?? 0) > 0) {
        <div class="marquee">
          <div class="marquee-track">
            @for (t of doubled(); track $index) { <span>{{ t }}</span> }
          </div>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .hero { position: relative; padding: clamp(2.5rem, 6vw, 5rem) 0 clamp(2rem, 5vw, 4rem); overflow: hidden; }
      .bg-gradient {
        position: absolute; inset: 0; pointer-events: none; z-index: -1;
        background:
          radial-gradient(900px 500px at 80% -10%, rgba(14,165,164,.18), transparent 60%),
          radial-gradient(700px 400px at -10% 30%, rgba(34,197,94,.14), transparent 60%);
      }
      .hero-grid {
        display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; align-items: center;
      }
      .badge {
        display: inline-flex; align-items: center; gap: .5rem;
        padding: .375rem .875rem; border-radius: var(--radius-pill);
        background: var(--accent-soft); color: var(--accent-1-dark);
        font-weight: 600; font-size: .8125rem;
        border: 1px solid rgba(14,165,164,0.18); margin-bottom: 1rem;
      }
      .dot { width: 8px; height: 8px; border-radius: 999px; background: var(--accent-2); box-shadow: 0 0 0 3px rgba(34,197,94,.18); }
      h1 {
        background: linear-gradient(135deg, var(--text-1) 30%, var(--accent-1) 100%);
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0 0 1.25rem;
      }
      .subhead { font-size: clamp(1rem, 1.5vw, 1.125rem); color: var(--text-2); margin: 0 0 1.75rem; max-width: 56ch; }
      .ctas { display: flex; gap: .75rem; flex-wrap: wrap; }
      .metrics {
        display: flex; gap: 2rem; margin-top: 2.25rem; flex-wrap: wrap;
      }
      .metric-value { font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; color: var(--text-1); }
      .metric-label { color: var(--text-2); font-size: .875rem; }

      .hero-visual { position: relative; aspect-ratio: 1; max-width: 360px; margin-left: auto; }
      .avatar {
        position: relative; z-index: 2;
        width: 100%; aspect-ratio: 1; border-radius: 50%;
        background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
        display: grid; place-items: center; overflow: hidden;
        box-shadow: 0 20px 60px rgba(14,165,164,.32);
      }
      .avatar img { width: 100%; height: 100%; object-fit: cover; }
      .avatar-fallback { color: #fff; font-family: var(--font-display); font-weight: 800; font-size: 4.5rem; }
      .orbit-1, .orbit-2 {
        position: absolute; border-radius: 50%; border: 2px dashed rgba(14,165,164,0.25);
        animation: spin 22s linear infinite;
      }
      .orbit-1 { inset: -10%; }
      .orbit-2 { inset: -22%; border-color: rgba(34,197,94,0.18); animation-duration: 35s; animation-direction: reverse; }
      @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }

      .marquee { margin-top: 3rem; overflow: hidden; border-top: 1px solid var(--border); padding: 1.25rem 0; }
      .marquee-track { display: flex; gap: 3rem; white-space: nowrap; animation: scroll-x 30s linear infinite; }
      .marquee-track span { color: var(--text-3); font-weight: 600; letter-spacing: .04em; text-transform: uppercase; font-size: .8125rem; }
      @keyframes scroll-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }

      @media (max-width: 880px) {
        .hero-grid { grid-template-columns: 1fr; gap: 2rem; }
        .hero-visual { max-width: 240px; margin: 0 auto; }
      }
    `,
  ],
})
export class HeroComponent {
  @Input() hero: HeroSection | null = null;
  @Input() profile: Profile | null = null;

  readonly apos = "'";

  initials(): string {
    const name = this.profile?.shortName || this.profile?.fullName || 'P';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'P';
  }

  doubled(): string[] {
    const m = this.hero?.techMarquee ?? [];
    return [...m, ...m];
  }
}
