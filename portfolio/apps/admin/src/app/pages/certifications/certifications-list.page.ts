import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { Certification } from '@portfolio/shared-types';
import { CertificationsService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-certifications-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Certifications</h1>
          <p class="page-subtitle">{{ items().length }} certification{{ items().length === 1 ? '' : 's' }}.</p>
        </div>
        <a mat-flat-button color="primary" routerLink="/certifications/new"><mat-icon>add</mat-icon> New</a>
      </div>
      @if (items().length === 0) {
        <div class="card empty-state">No certifications yet.</div>
      } @else {
        <table class="list-table">
          <thead><tr><th>Title</th><th>Issuer</th><th>Issued</th><th>Order</th><th></th></tr></thead>
          <tbody>
            @for (c of items(); track c._id) {
              <tr>
                <td>{{ c.title }}</td>
                <td>{{ c.issuer }}</td>
                <td>{{ c.issueDate }}</td>
                <td>{{ c.order }}</td>
                <td class="btn-row">
                  <a mat-icon-button [routerLink]="['/certifications', c._id]"><mat-icon>edit</mat-icon></a>
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
export class CertificationsListPage implements OnInit {
  private readonly api = inject(CertificationsService);
  private readonly snack = inject(MatSnackBar);
  readonly items = signal<Certification[]>([]);
  ngOnInit(): void { this.api.list().subscribe((r) => this.items.set(r.data ?? [])); }
  remove(c: Certification): void {
    if (!c._id || !confirm(`Delete "${c.title}"?`)) return;
    this.api.remove(c._id).subscribe(() => {
      this.snack.open('Deleted', 'Dismiss', { duration: 2500 });
      this.api.list().subscribe((r) => this.items.set(r.data ?? []));
    });
  }
}
