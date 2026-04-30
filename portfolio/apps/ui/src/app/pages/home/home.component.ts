import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProjectService } from '../../services/common/project.service';
import { SettingsService } from '../../services/common/settings.service';
import type { Project, Settings } from '@portfolio/shared-types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  settings$!: Observable<Settings>;
  featured$!: Observable<Project[]>;

  constructor(
    private readonly projects: ProjectService,
    private readonly settings: SettingsService,
  ) {}

  ngOnInit(): void {
    this.settings$ = this.settings.get();
    this.featured$ = this.projects.getFeatured().pipe(
      map((r) => r.data ?? []),
      catchError(() => of([])),
    );
  }
}
