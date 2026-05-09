import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { Experience } from '@portfolio/shared-types';

import { ExperienceService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-experience-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Experience</h1>
          <p class="page-subtitle">{{ items().length }} entr{{ items().length === 1 ? 'y' : 'ies' }}.</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/experience/new">
          <mat-icon>add</mat-icon> New experience
        </a>
      </div>

      @if (items().length === 0) {
        <div class="card empty-state">No experience entries yet. Click "New experience" to add one.</div>
      } @else {
        <table class="list-table">
          <thead>
            <tr>
              <th>Role</th><th>Company</th><th>Period</th><th>Order</th><th></th>
            </tr>
          </thead>
          <tbody>
            @for (e of items(); track e._id) {
              <tr>
                <td>{{ e.role }}</td>
                <td>{{ e.company }}</td>
                <td>{{ e.startDate }} — {{ e.current ? 'Present' : (e.endDate || '?') }}</td>
                <td>{{ e.order }}</td>
                <td class="btn-row">
                  <a mat-icon-button [routerLink]="['/experience', e._id]"><mat-icon>edit</mat-icon></a>
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
export class ExperienceListPage implements OnInit {
  private readonly api = inject(ExperienceService);
  private readonly snack = inject(MatSnackBar);
  readonly items = signal<Experience[]>([]);

  ngOnInit(): void { this.load(); }
  private load(): void {
    this.api.list().subscribe((res) => this.items.set(res.data ?? []));
  }

  remove(e: Experience): void {
    if (!e._id) return;
    if (!confirm(`Delete "${e.role} at ${e.company}"?`)) return;
    this.api.remove(e._id).subscribe(() => {
      this.snack.open('Deleted', 'Dismiss', { duration: 2500 });
      this.load();
    });
  }
}
