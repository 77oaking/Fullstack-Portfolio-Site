import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProjectService } from '../../services/common/project.service';
import { CvService } from '../../services/common/cv.service';
import { SettingsService } from '../../services/common/settings.service';
import type { CvPublicPayload, Project, Settings } from '@portfolio/shared-types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  settings$!: Observable<Settings>;
  featured$!: Observable<Project[]>;
  cv$!: Observable<CvPublicPayload | null>;

  constructor(
    private readonly projects: ProjectService,
    private readonly cv: CvService,
    private readonly settings: SettingsService,
  ) {}

  ngOnInit(): void {
    this.settings.refresh();
    this.settings$ = this.settings.get();
    this.cv$ = this.cv.getPublicCv().pipe(
      map((r) => r.data ?? null),
      catchError(() => of(null)),
    );
    this.featured$ = this.projects.getFeatured().pipe(
      map((r) => r.data ?? []),
      catchError(() => of([])),
    );
  }

  fullName(cv: CvPublicPayload | null, settings: Settings): string {
    const first = cv?.personal?.firstName ?? '';
    const last = cv?.personal?.lastName ?? '';
    const name = `${first} ${last}`.trim();
    return name || settings.ownerName || 'Portfolio Owner';
  }
}
