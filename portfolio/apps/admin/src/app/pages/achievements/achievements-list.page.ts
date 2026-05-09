import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { Achievement } from '@portfolio/shared-types';
import { AchievementsService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-achievements-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Achievements</h1>
          <p class="page-subtitle">{{ items().length }} achievement{{ items().length === 1 ? '' : 's' }}.</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/achievements/new"><mat-icon>add</mat-icon> New</a>
      </div>
      @if (items().length === 0) {
        <div class="card empty-state">No achievements yet.</div>
      } @else {
        <table class="list-table">
          <thead><tr><th>Title</th><th>Date</th><th>Order</th><th></th></tr></thead>
          <tbody>
            @for (a of items(); track a._id) {
              <tr>
                <td>{{ a.title }}</td>
                <td>{{ a.date }}</td>
                <td>{{ a.order }}</td>
                <td class="btn-row">
                  <a mat-icon-button [routerLink]="['/achievements', a._id]"><mat-icon>edit</mat-icon></a>
                  <button mat-icon-button color="warn" (click)="remove(a)"><mat-icon>delete</mat-icon></button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class AchievementsListPage implements OnInit {
  private readonly api = inject(AchievementsService);
  private readonly snack = inject(MatSnackBar);
  readonly items = signal<Achievement[]>([]);
  ngOnInit(): void { this.api.list().subscribe((r) => this.items.set(r.data ?? [])); }
  remove(a: Achievement): void {
    if (!a._id || !confirm(`Delete "${a.title}"?`)) return;
    this.api.remove(a._id).subscribe(() => {
      this.snack.open('Deleted', 'Dismiss', { duration: 2500 });
      this.api.list().subscribe((r) => this.items.set(r.data ?? []));
    });
  }
}
