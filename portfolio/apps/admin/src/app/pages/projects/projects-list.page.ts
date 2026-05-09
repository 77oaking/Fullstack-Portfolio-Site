import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { Project } from '@portfolio/shared-types';

import { ProjectsService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Projects</h1>
          <p class="page-subtitle">{{ items().length }} project{{ items().length === 1 ? '' : 's' }}.</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/projects/new"><mat-icon>add</mat-icon> New project</a>
      </div>

      @if (items().length === 0) {
        <div class="card empty-state">No projects yet.</div>
      } @else {
        <table class="list-table">
          <thead><tr><th>Title</th><th>Status</th><th>Featured</th><th>Order</th><th></th></tr></thead>
          <tbody>
            @for (p of items(); track p._id) {
              <tr>
                <td>{{ p.title }}<div style="color:#94a3b8;font-size:.8125rem">/{{ p.slug }}</div></td>
                <td>{{ p.status }}</td>
                <td>{{ p.featured ? 'Yes' : '' }}</td>
                <td>{{ p.order }}</td>
                <td class="btn-row">
                  <a mat-icon-button [routerLink]="['/projects', p._id]"><mat-icon>edit</mat-icon></a>
                  <button mat-icon-button color="warn" (click)="remove(p)"><mat-icon>delete</mat-icon></button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class ProjectsListPage implements OnInit {
  private readonly api = inject(ProjectsService);
  private readonly snack = inject(MatSnackBar);
  readonly items = signal<Project[]>([]);

  ngOnInit(): void { this.load(); }
  private load(): void { this.api.list().subscribe((r) => this.items.set(r.data ?? [])); }

  remove(p: Project): void {
    if (!p._id) return;
    if (!confirm(`Delete project "${p.title}"?`)) return;
    this.api.remove(p._id).subscribe(() => { this.snack.open('Deleted', 'Dismiss', { duration: 2500 }); this.load(); });
  }
}
