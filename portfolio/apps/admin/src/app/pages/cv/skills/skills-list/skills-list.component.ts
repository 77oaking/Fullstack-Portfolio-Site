import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Skill } from '@portfolio/shared-types';
import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss'],
})
export class SkillsListComponent implements OnInit {
  items: Skill[] = [];
  loading = false;
  displayedColumns = ['name', 'category', 'level', 'years', 'visible', 'actions'];

  readonly levelLabels: Record<number, string> = { 1: 'Beginner', 2: 'Elementary', 3: 'Intermediate', 4: 'Advanced', 5: 'Expert' };

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
    this.cv.getSkills().subscribe({
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
    this.router.navigate(['/cv/skills/add']);
  }

  edit(item: Skill): void {
    this.router.navigate(['/cv/skills/edit', item._id]);
  }

  delete(item: Skill): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Skill',
        message: `Remove skill "${item.name}"?`,
        confirmLabel: 'Delete',
        destructive: true,
      },
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.cv.removeSkill(item._id).subscribe({
        next: () => {
          this.ui.success('Skill deleted.');
          this.load();
        },
        error: () => this.ui.error('Failed to delete.'),
      });
    });
  }

  levelStars(level: number): number[] {
    return Array.from({ length: level });
  }
}
