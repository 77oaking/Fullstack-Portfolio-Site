import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Language } from '@portfolio/shared-types';
import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-languages-list',
  templateUrl: './languages-list.component.html',
  styleUrls: ['./languages-list.component.scss'],
})
export class LanguagesListComponent implements OnInit {
  items: Language[] = [];
  loading = false;
  displayedColumns = ['name', 'proficiency', 'actions'];

  readonly proficiencyLabel: Record<string, string> = {
    native: 'Native',
    fluent: 'Fluent',
    advanced: 'Advanced',
    intermediate: 'Intermediate',
    basic: 'Basic',
  };

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
    this.cv.getLanguages().subscribe({
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
    this.router.navigate(['/cv/languages/add']);
  }

  edit(item: Language): void {
    this.router.navigate(['/cv/languages/edit', item._id]);
  }

  delete(item: Language): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Language',
        message: `Remove "${item.name}"?`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.cv.removeLanguage(item._id).subscribe({
        next: () => {
          this.ui.success('Language deleted.');
          this.load();
        },
        error: () => this.ui.error('Failed to delete.'),
      });
    });
  }
}
