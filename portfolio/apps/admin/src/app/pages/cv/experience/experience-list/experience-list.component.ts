import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Experience } from '@portfolio/shared-types';
import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-experience-list',
  templateUrl: './experience-list.component.html',
  styleUrls: ['./experience-list.component.scss'],
})
export class ExperienceListComponent implements OnInit {
  items: Experience[] = [];
  loading = false;
  displayedColumns = ['role', 'company', 'dates', 'visible', 'actions'];

  constructor(
    private readonly cv: CvService,
    private readonly ui: UiService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.cv.getExperiences().subscribe({
      next: (res) => {
        this.items = res.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  add(): void {
    this.router.navigate(['/cv/experience/add']);
  }

  edit(item: Experience): void {
    this.router.navigate(['/cv/experience/edit', item._id]);
  }

  delete(item: Experience): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Experience',
        message: `Remove "${item.role} at ${item.company}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.cv.removeExperience(item._id).subscribe({
        next: () => {
          this.ui.success('Experience deleted.');
          this.load();
        },
        error: () => this.ui.error('Failed to delete.'),
      });
    });
  }

  dateRange(item: Experience): string {
    const end = item.endDate ? new Date(item.endDate).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : 'Present';
    const start = new Date(item.startDate).toLocaleDateString('en', { month: 'short', year: 'numeric' });
    return `${start} – ${end}`;
  }
}
