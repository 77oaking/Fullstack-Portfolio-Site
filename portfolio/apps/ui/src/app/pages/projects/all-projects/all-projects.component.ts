import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProjectService } from '../../../services/common/project.service';
import type { Project } from '@portfolio/shared-types';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss'],
})
export class AllProjectsComponent implements OnInit {
  projects$!: Observable<Project[]>;

  constructor(private readonly projects: ProjectService) {}

  ngOnInit(): void {
    this.projects$ = this.projects.getAll({ pagination: { pageNumber: 1, pageSize: 50 } }).pipe(
      map((r) => r.data ?? []),
      catchError(() => of([])),
    );
  }
}
