import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { Education } from '@portfolio/shared-types';

import { EducationService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-education-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Education</h1>
          <p class="page-subtitle">{{ items().length }} entr{{ items().length === 1 ? 'y' : 'ies' }}.</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/education/new"><mat-icon>add</mat-icon> New education</a>
      </div>

      @if (items().length === 0) {
        <div class="card empty-state">No education entries yet.</div>
      } @else {
        <table class="list-table">
          <thead><tr><th>Institution</th><th>Degree</th><th>Period</th><th>Order</th><th></th></tr></thead>
          <tbody>
            @for (e of items(); track e._id) {
              <tr>
                <td>{{ e.institution }}</td>
                <td>{{ e.degree }}{{ e.fieldOfStudy ? ' · ' + e.fieldOfStudy : '' }}</td>
                <td>{{ e.startDate }} — {{ e.current ? 'Present' : (e.endDate || '?') }}</td>
                <td>{{ e.order }}</td>
                <td class="btn-row">
                  <a mat-icon-button [routerLink]="['/education', e._id]"><mat-icon>edit</mat-icon></a>
                  <button mat-icon-button color="warn" (click)="remove(e)"><mat-icon>delete</mat-icon></button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class EducationListPage implements OnInit {
  private readonly api = inject(EducationService);
  private readonly snack = inject(MatSnackBar);
  readonly items = signal<Education[]>([]);

  ngOnInit(): void { this.load(); }
  private load(): void { this.api.list().subscribe((r) => this.items.set(r.data ?? [])); }

  remove(e: Education): void {
    if (!e._id) return;
    if (!confirm(`Delete "${e.degree} at ${e.institution}"?`)) return;
    this.api.remove(e._id).subscribe(() => {
      this.snack.open('Deleted', 'Dismiss', { duration: 2500 });
      this.load();
    });
  }
}
