import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  AboutSection,
  Achievement,
  BlogPost,
  Certification,
  ContactMessage,
  Education,
  Experience,
  HeroSection,
  PortfolioBundle,
  Profile,
  Project,
  ResponsePayload,
  Service,
  SiteSettings,
  SkillCategory,
  Testimonial,
} from '@portfolio/shared-types';
import { ApiResource, SingletonResource } from './api-resource.service';
import { environment } from '../../environments/environment';

/* Singletons */

@Injectable({ providedIn: 'root' })
export class ProfileService extends SingletonResource<Profile> {
  protected readonly path = 'profile';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class HeroService extends SingletonResource<HeroSection> {
  protected readonly path = 'hero';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class AboutService extends SingletonResource<AboutSection> {
  protected readonly path = 'about';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class SettingsService extends SingletonResource<SiteSettings> {
  protected readonly path = 'settings';
  constructor() { super(inject(HttpClient)); }
}

/* Collections */

@Injectable({ providedIn: 'root' })
export class ExperienceService extends ApiResource<Experience> {
  protected readonly path = 'experience';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class EducationService extends ApiResource<Education> {
  protected readonly path = 'education';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class SkillsService extends ApiResource<SkillCategory> {
  protected readonly path = 'skills';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class ProjectsService extends ApiResource<Project> {
  protected readonly path = 'projects';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class ServicesService extends ApiResource<Service> {
  protected readonly path = 'services';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class TestimonialsService extends ApiResource<Testimonial> {
  protected readonly path = 'testimonials';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class CertificationsService extends ApiResource<Certification> {
  protected readonly path = 'certifications';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class AchievementsService extends ApiResource<Achievement> {
  protected readonly path = 'achievements';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class BlogService extends ApiResource<BlogPost> {
  protected readonly path = 'blog';
  constructor() { super(inject(HttpClient)); }
}

@Injectable({ providedIn: 'root' })
export class ContactMessagesService extends ApiResource<ContactMessage> {
  protected readonly path = 'contact';
  constructor() { super(inject(HttpClient)); }
}

/* Aggregate */

@Injectable({ providedIn: 'root' })
export class PortfolioBundleService {
  private readonly http = inject(HttpClient);
  bundle(): Observable<ResponsePayload<PortfolioBundle>> {
    return this.http.get<ResponsePayload<PortfolioBundle>>(`${environment.apiBaseUrl}/portfolio`);
  }
}

/* Admin operations (reset) */

@Injectable({ providedIn: 'root' })
export class AdminOpsService {
  private readonly http = inject(HttpClient);
  resetAll(): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${environment.apiBaseUrl}/admin/reset`, {
      confirm: 'RESET',
    });
  }
}
