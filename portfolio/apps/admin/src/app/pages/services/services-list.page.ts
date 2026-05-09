import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { Service } from '@portfolio/shared-types';
import { ServicesService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Services</h1>
          <p class="page-subtitle">{{ items().length }} service{{ items().length === 1 ? '' : 's' }}.</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/services/new"><mat-icon>add</mat-icon> New service</a>
      </div>
      @if (items().length === 0) {
        <div class="card empty-state">No services yet.</div>
      } @else {
        <table class="list-table">
          <thead><tr><th>Title</th><th>Features</th><th>Order</th><th></th></tr></thead>
          <tbody>
            @for (s of items(); track s._id) {
              <tr>
                <td>{{ s.title }}</td>
                <td>{{ (s.features?.length ?? 0) }}</td>
                <td>{{ s.order }}</td>
                <td class="btn-row">
                  <a mat-icon-button [routerLink]="['/services', s._id]"><mat-icon>edit</mat-icon></a>
                  <button mat-icon-button color="warn" (click)="remove(s)"><mat-icon>delete</mat-icon></button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class ServicesListPage implements OnInit {
  private readonly api = inject(ServicesService);
  private readonly snack = inject(MatSnackBar);
  readonly items = signal<Service[]>([]);
  ngOnInit(): void { this.api.list().subscribe((r) => this.items.set(r.data ?? [])); }
  remove(s: Service): void {
    if (!s._id || !confirm(`Delete "${s.title}"?`)) return;
    this.api.remove(s._id).subscribe(() => {
      this.snack.open('Deleted', 'Dismiss', { duration: 2500 });
      this.api.list().subscribe((r) => this.items.set(r.data ?? []));
    });
  }
}
