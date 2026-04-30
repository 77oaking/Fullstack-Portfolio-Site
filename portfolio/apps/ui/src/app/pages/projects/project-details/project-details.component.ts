import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProjectService } from '../../../services/common/project.service';
import type { Project } from '@portfolio/shared-types';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  project$!: Observable<Project | null>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly projects: ProjectService,
  ) {}

  ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      switchMap((p) => {
        const slug = p.get('slug');
        if (!slug) return of(null);
        return this.projects.getBySlug(slug).pipe(
          map((r) => r.data ?? null),
          catchError(() => of(null)),
        );
      }),
    );
  }
}
