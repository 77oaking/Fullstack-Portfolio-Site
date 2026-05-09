import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Education } from '@portfolio/shared-types';
import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-education-list',
  templateUrl: './education-list.component.html',
  styleUrls: ['./education-list.component.scss'],
})
export class EducationListComponent implements OnInit {
  items: Education[] = [];
  loading = false;
  displayedColumns = ['institution', 'degree', 'dates', 'visible', 'actions'];

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
    this.cv.getEducations().subscribe({
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
    this.router.navigate(['/cv/education/add']);
  }

  edit(item: Education): void {
    this.router.navigate(['/cv/education/edit', item._id]);
  }

  delete(item: Education): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Education',
        message: `Remove "${item.degree} at ${item.institution}"?`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.cv.removeEducation(item._id).subscribe({
        next: () => {
          this.ui.success('Education deleted.');
          this.load();
        },
        error: () => this.ui.error('Failed to delete.'),
      });
    });
  }

  dateRange(item: Education): string {
    const end = item.endDate ? new Date(item.endDate).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : 'Present';
    const start = new Date(item.startDate).toLocaleDateString('en', { month: 'short', year: 'numeric' });
    return `${start} – ${end}`;
  }
}
