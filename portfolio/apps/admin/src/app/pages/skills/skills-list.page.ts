import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { SkillCategory } from '@portfolio/shared-types';

import { SkillsService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-skills-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Skill categories</h1>
          <p class="page-subtitle">{{ items().length }} categor{{ items().length === 1 ? 'y' : 'ies' }}.</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/skills/new"><mat-icon>add</mat-icon> New category</a>
      </div>

      @if (items().length === 0) {
        <div class="card empty-state">No skill categories yet.</div>
      } @else {
        <table class="list-table">
          <thead><tr><th>Category</th><th>Items</th><th>Order</th><th></th></tr></thead>
          <tbody>
            @for (c of items(); track c._id) {
              <tr>
                <td>{{ c.name }}</td>
                <td>{{ (c.items?.length ?? 0) }} skill{{ c.items?.length === 1 ? '' : 's' }}</td>
                <td>{{ c.order }}</td>
                <td class="btn-row">
                  <a mat-icon-button [routerLink]="['/skills', c._id]"><mat-icon>edit</mat-icon></a>
                  <button mat-icon-button color="warn" (click)="remove(c)"><mat-icon>delete</mat-icon></button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class SkillsListPage implements OnInit {
  private readonly api = inject(SkillsService);
  private readonly snack = inject(MatSnackBar);
  readonly items = signal<SkillCategory[]>([]);

  ngOnInit(): void { this.load(); }
  private load(): void { this.api.list().subscribe((r) => this.items.set(r.data ?? [])); }

  remove(c: SkillCategory): void {
    if (!c._id) return;
    if (!confirm(`Delete category "${c.name}"?`)) return;
    this.api.remove(c._id).subscribe(() => { this.snack.open('Deleted', 'Dismiss', { duration: 2500 }); this.load(); });
  }
}
