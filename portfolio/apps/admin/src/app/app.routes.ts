import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'hero',
        loadComponent: () => import('./pages/hero/hero.page').then((m) => m.HeroPage),
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.page').then((m) => m.AboutPage),
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./pages/experience/experience-list.page').then((m) => m.ExperienceListPage),
      },
      {
        path: 'experience/new',
        loadComponent: () =>
          import('./pages/experience/experience-form.page').then((m) => m.ExperienceFormPage),
      },
      {
        path: 'experience/:id',
        loadComponent: () =>
          import('./pages/experience/experience-form.page').then((m) => m.ExperienceFormPage),
      },
      {
        path: 'education',
        loadComponent: () =>
          import('./pages/education/education-list.page').then((m) => m.EducationListPage),
      },
      {
        path: 'education/new',
        loadComponent: () =>
          import('./pages/education/education-form.page').then((m) => m.EducationFormPage),
      },
      {
        path: 'education/:id',
        loadComponent: () =>
          import('./pages/education/education-form.page').then((m) => m.EducationFormPage),
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./pages/skills/skills-list.page').then((m) => m.SkillsListPage),
      },
      {
        path: 'skills/new',
        loadComponent: () =>
          import('./pages/skills/skills-form.page').then((m) => m.SkillsFormPage),
      },
      {
        path: 'skills/:id',
        loadComponent: () =>
          import('./pages/skills/skills-form.page').then((m) => m.SkillsFormPage),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects-list.page').then((m) => m.ProjectsListPage),
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./pages/projects/projects-form.page').then((m) => m.ProjectsFormPage),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./pages/projects/projects-form.page').then((m) => m.ProjectsFormPage),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./pages/services/services-list.page').then((m) => m.ServicesListPage),
      },
      {
        path: 'services/new',
        loadComponent: () =>
          import('./pages/services/services-form.page').then((m) => m.ServicesFormPage),
      },
      {
        path: 'services/:id',
        loadComponent: () =>
          import('./pages/services/services-form.page').then((m) => m.ServicesFormPage),
      },
      {
        path: 'testimonials',
        loadComponent: () =>
          import('./pages/testimonials/testimonials-list.page').then(
            (m) => m.TestimonialsListPage,
          ),
      },
      {
        path: 'testimonials/new',
        loadComponent: () =>
          import('./pages/testimonials/testimonials-form.page').then(
            (m) => m.TestimonialsFormPage,
          ),
      },
      {
        path: 'testimonials/:id',
        loadComponent: () =>
          import('./pages/testimonials/testimonials-form.page').then(
            (m) => m.TestimonialsFormPage,
          ),
      },
      {
        path: 'certifications',
        loadComponent: () =>
          import('./pages/certifications/certifications-list.page').then(
            (m) => m.CertificationsListPage,
          ),
      },
      {
        path: 'certifications/new',
        loadComponent: () =>
          import('./pages/certifications/certifications-form.page').then(
            (m) => m.CertificationsFormPage,
          ),
      },
      {
        path: 'certifications/:id',
        loadComponent: () =>
          import('./pages/certifications/certifications-form.page').then(
            (m) => m.CertificationsFormPage,
          ),
      },
      {
        path: 'achievements',
        loadComponent: () =>
          import('./pages/achievements/achievements-list.page').then(
            (m) => m.AchievementsListPage,
          ),
      },
      {
        path: 'achievements/new',
        loadComponent: () =>
          import('./pages/achievements/achievements-form.page').then(
            (m) => m.AchievementsFormPage,
          ),
      },
      {
        path: 'achievements/:id',
        loadComponent: () =>
          import('./pages/achievements/achievements-form.page').then(
            (m) => m.AchievementsFormPage,
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./pages/messages/messages-list.page').then((m) => m.MessagesListPage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'danger-zone',
        loadComponent: () =>
          import('./pages/danger-zone/danger-zone.page').then((m) => m.DangerZonePage),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
