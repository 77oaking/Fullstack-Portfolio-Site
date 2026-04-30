import { Component, OnInit } from '@angular/core';

import { ProjectService } from '../../services/common/project.service';
import { ThemeService } from '../../services/common/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  projectsCount = 0;
  themesCount = 0;
  activeThemeName = '—';

  constructor(
    private readonly projects: ProjectService,
    private readonly themes: ThemeService,
  ) {}

  ngOnInit(): void {
    this.projects.getAll({ pagination: { pageNumber: 1, pageSize: 1 } }).subscribe({
      next: (r) => (this.projectsCount = r.count ?? 0),
    });
    this.themes.list().subscribe({
      next: (r) => (this.themesCount = r.data?.length ?? 0),
    });
    this.themes.active().subscribe({
      next: (r) => (this.activeThemeName = r.data?.name ?? '—'),
    });
  }
}
