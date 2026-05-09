import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Award } from '@portfolio/shared-types';
import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-awards-list',
  templateUrl: './awards-list.component.html',
  styleUrls: ['./awards-list.component.scss'],
})
export class AwardsListComponent implements OnInit {
  items: Award[] = [];
  loading = false;
  displayedColumns = ['title', 'issuer', 'date', 'visible', 'actions'];

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
    this.cv.getAwards().subscribe({
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
    this.router.navigate(['/cv/awards/add']);
  }

  edit(item: Award): void {
    this.router.navigate(['/cv/awards/edit', item._id]);
  }

  delete(item: Award): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Award',
        message: `Remove "${item.title}"?`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.cv.removeAward(item._id).subscribe({
        next: () => {
          this.ui.success('Award deleted.');
          this.load();
        },
        error: () => this.ui.error('Failed to delete.'),
      });
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en', { month: 'short', year: 'numeric' });
  }
}
