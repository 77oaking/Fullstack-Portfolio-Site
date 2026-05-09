import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AdminOpsService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-danger-zone',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Danger zone</h1>
          <p class="page-subtitle">Operations that cannot be undone.</p>
        </div>
      </div>

      <div class="card danger-card">
        <h2><mat-icon style="vertical-align:middle">warning</mat-icon> Reset all portfolio data</h2>
        <p>
          This deletes <strong>every</strong> portfolio record from the database — profile, hero, about,
          experience, education, skills, projects, services, testimonials, certifications, achievements,
          blog posts, contact messages and settings. Your admin login is preserved.
        </p>
        <p style="font-size:.875rem;color:#7f1d1d">
          To confirm, type <code>RESET</code> in the box below and click the button.
        </p>

        <mat-form-field appearance="outline" style="max-width:280px">
          <mat-label>Type RESET to confirm</mat-label>
          <input matInput [(ngModel)]="confirm" />
        </mat-form-field>

        <div class="btn-row">
          <button
            mat-flat-button
            color="warn"
            [disabled]="confirm !== 'RESET' || running()"
            (click)="reset()"
          >
            {{ running() ? 'Wiping…' : 'Reset all data' }}
          </button>
        </div>

        @if (lastResult(); as r) {
          <div style="margin-top: 1rem; font-family: ui-monospace, monospace; font-size: .8125rem; color:#475569">
            {{ r }}
          </div>
        }
      </div>
    </div>
  `,
})
export class DangerZonePage {
  private readonly api = inject(AdminOpsService);
  private readonly snack = inject(MatSnackBar);

  confirm = '';
  readonly running = signal(false);
  readonly lastResult = signal<string | null>(null);

  reset(): void {
    if (this.confirm !== 'RESET') return;
    this.running.set(true);
    this.api.resetAll().subscribe({
      next: (res) => {
        this.running.set(false);
        this.confirm = '';
        this.lastResult.set(JSON.stringify(res.data ?? {}, null, 2));
        this.snack.open(res.message ?? 'Reset complete', 'Dismiss', { duration: 4000 });
      },
      error: () => this.running.set(false),
    });
  }
}
