import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Certification } from '@portfolio/shared-types';
import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-certifications-list',
  templateUrl: './certifications-list.component.html',
  styleUrls: ['./certifications-list.component.scss'],
})
export class CertificationsListComponent implements OnInit {
  items: Certification[] = [];
  loading = false;
  displayedColumns = ['name', 'issuer', 'issueDate', 'visible', 'actions'];

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
    this.cv.getCertifications().subscribe({
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
    this.router.navigate(['/cv/certifications/add']);
  }

  edit(item: Certification): void {
    this.router.navigate(['/cv/certifications/edit', item._id]);
  }

  delete(item: Certification): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Certification',
        message: `Remove "${item.name}"?`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.cv.removeCertification(item._id).subscribe({
        next: () => {
          this.ui.success('Certification deleted.');
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
