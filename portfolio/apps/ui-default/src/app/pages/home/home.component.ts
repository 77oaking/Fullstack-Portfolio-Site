import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioService } from '../../services/portfolio.service';
import { HeaderComponent } from '../../sections/header/header.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { AboutComponent } from '../../sections/about/about.component';
import { ExperienceComponent } from '../../sections/experience/experience.component';
import { EducationComponent } from '../../sections/education/education.component';
import { SkillsComponent } from '../../sections/skills/skills.component';
import { ProjectsComponent } from '../../sections/projects/projects.component';
import { ServicesComponent } from '../../sections/services/services.component';
import { TestimonialsComponent } from '../../sections/testimonials/testimonials.component';
import { CertificationsComponent } from '../../sections/certifications/certifications.component';
import { AchievementsComponent } from '../../sections/achievements/achievements.component';
import { ContactComponent } from '../../sections/contact/contact.component';
import { FooterComponent } from '../../sections/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    EducationComponent,
    SkillsComponent,
    ProjectsComponent,
    ServicesComponent,
    TestimonialsComponent,
    CertificationsComponent,
    AchievementsComponent,
    ContactComponent,
    FooterComponent,
  ],
  template: `
    @if (loading()) {
      <div class="splash">
        <div class="splash-mark"></div>
        <p>Loading…</p>
      </div>
    }

    @if (errorMsg()) {
      <div class="error-page">
        <h1>Couldn't reach the API</h1>
        <p>{{ errorMsg() }}</p>
        <p>Make sure the API is running on the address configured in <code>environment.ts</code> and that you've seeded data with <code>npm run seed</code>.</p>
      </div>
    }

    @if (bundle(); as b) {
      <app-header [profile]="b.profile" [settings]="b.settings"></app-header>

      @if (features().showHero) {
        <app-hero [hero]="b.hero" [profile]="b.profile"></app-hero>
      }

      @if (features().showAbout) {
        <app-about [about]="b.about" [profile]="b.profile"></app-about>
      }

      @if (features().showExperience && b.experiences.length > 0) {
        <app-experience [items]="b.experiences"></app-experience>
      }

      @if (features().showSkills && b.skillCategories.length > 0) {
        <app-skills [categories]="b.skillCategories"></app-skills>
      }

      @if (features().showProjects && b.projects.length > 0) {
        <app-projects [items]="b.projects"></app-projects>
      }

      @if (features().showServices && b.services.length > 0) {
        <app-services [items]="b.services"></app-services>
      }

      @if (features().showEducation && b.educations.length > 0) {
        <app-education [items]="b.educations"></app-education>
      }

      @if (features().showCertifications && b.certifications.length > 0) {
        <app-certifications [items]="b.certifications"></app-certifications>
      }

      @if (features().showAchievements && b.achievements.length > 0) {
        <app-achievements [items]="b.achievements"></app-achievements>
      }

      @if (features().showTestimonials && b.testimonials.length > 0) {
        <app-testimonials [items]="b.testimonials"></app-testimonials>
      }

      @if (features().showContact) {
        <app-contact [profile]="b.profile"></app-contact>
      }

      <app-footer [profile]="b.profile" [settings]="b.settings"></app-footer>
    }
  `,
  styles: [
    `
      .splash {
        min-height: 100vh; display: grid; place-items: center; gap: 1rem;
        color: var(--text-2); background: var(--bg);
      }
      .splash-mark {
        width: 56px; height: 56px; border-radius: 16px;
        background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
        animation: pulse 1.4s ease-in-out infinite;
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: .9; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      .error-page {
        max-width: 560px; margin: 6rem auto; padding: 2rem; text-align: center;
        color: var(--text-2);
      }
      .error-page h1 { color: var(--text-1); margin-bottom: 1rem; }
      code { background: var(--bg-soft); padding: 2px 6px; border-radius: 6px; font-size: .875em; }
    `,
  ],
})
export class HomeComponent implements OnInit {
  private readonly api = inject(PortfolioService);

  readonly bundle = this.api.bundle;
  readonly loading = this.api.loading;
  readonly errorMsg = this.api.error;

  readonly features = computed(() => {
    const f = this.bundle()?.settings?.features;
    return {
      showHero: f?.showHero ?? true,
      showAbout: f?.showAbout ?? true,
      showExperience: f?.showExperience ?? true,
      showEducation: f?.showEducation ?? true,
      showSkills: f?.showSkills ?? true,
      showProjects: f?.showProjects ?? true,
      showServices: f?.showServices ?? true,
      showTestimonials: f?.showTestimonials ?? true,
      showCertifications: f?.showCertifications ?? true,
      showAchievements: f?.showAchievements ?? true,
      showBlog: f?.showBlog ?? false,
      showContact: f?.showContact ?? true,
    };
  });

  ngOnInit(): void {
    this.api.load();
  }
}
