import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { Testimonial } from '@portfolio/shared-types';
import { TestimonialsService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-testimonials-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Testimonials</h1>
          <p class="page-subtitle">{{ items().length }} testimonial{{ items().length === 1 ? '' : 's' }}.</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/testimonials/new"><mat-icon>add</mat-icon> New</a>
      </div>
      @if (items().length === 0) {
        <div class="card empty-state">No testimonials yet.</div>
      } @else {
        <table class="list-table">
          <thead><tr><th>Name</th><th>Role</th><th>Company</th><th>Order</th><th></th></tr></thead>
          <tbody>
            @for (t of items(); track t._id) {
              <tr>
                <td>{{ t.name }}</td>
                <td>{{ t.role }}</td>
                <td>{{ t.company }}</td>
                <td>{{ t.order }}</td>
                <td class="btn-row">
                  <a mat-icon-button [routerLink]="['/testimonials', t._id]"><mat-icon>edit</mat-icon></a>
                  <button mat-icon-button color="warn" (click)="remove(t)"><mat-icon>delete</mat-icon></button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
})
export class TestimonialsListPage implements OnInit {
  private readonly api = inject(TestimonialsService);
  private readonly snack = inject(MatSnackBar);
  readonly items = signal<Testimonial[]>([]);
  ngOnInit(): void { this.api.list().subscribe((r) => this.items.set(r.data ?? [])); }
  remove(t: Testimonial): void {
    if (!t._id || !confirm(`Delete testimonial from ${t.name}?`)) return;
    this.api.remove(t._id).subscribe(() => {
      this.snack.open('Deleted', 'Dismiss', { duration: 2500 });
      this.api.list().subscribe((r) => this.items.set(r.data ?? []));
    });
  }
}
