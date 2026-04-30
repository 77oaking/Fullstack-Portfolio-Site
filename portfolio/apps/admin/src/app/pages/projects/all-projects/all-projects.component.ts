import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ProjectService } from '../../../services/common/project.service';
import { UiService } from '../../../services/common/ui.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import type { Project } from '@portfolio/shared-types';

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss'],
})
export class AllProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  total = 0;
  pageNumber = 1;
  pageSize = 20;

  readonly columns = ['order', 'title', 'status', 'featured', 'tags', 'actions'];

  constructor(
    private readonly service: ProjectService,
    private readonly dialog: MatDialog,
    private readonly ui: UiService,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.service
      .getAll({ pagination: { pageNumber: this.pageNumber, pageSize: this.pageSize } })
      .subscribe({
        next: (r) => {
          this.projects = r.data ?? [];
          this.total = r.count ?? 0;
          this.loading = false;
        },
        error: (err) => {
          this.ui.error(err?.error?.message ?? 'Failed to load projects');
          this.loading = false;
        },
      });
  }

  remove(p: Project): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: `Delete '${p.title}'?`,
          message: 'This cannot be undone.',
          confirmLabel: 'Delete',
          destructive: true,
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.service.remove(p._id).subscribe({
          next: () => {
            this.ui.success('Project deleted');
            this.refresh();
          },
          error: (err) => this.ui.error(err?.error?.message ?? 'Delete failed'),
        });
      });
  }
}
