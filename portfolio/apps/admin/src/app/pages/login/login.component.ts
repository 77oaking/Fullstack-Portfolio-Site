import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-bg">
      <form class="login-card" [formGroup]="form" (ngSubmit)="submit()">
        <h1>Portfolio Admin</h1>
        <p>Sign in with your admin credentials.</p>

        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" autocomplete="username" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" autocomplete="current-password" />
        </mat-form-field>

        @if (error()) { <p class="error">{{ error() }}</p> }

        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
          @if (loading()) {
            <mat-spinner diameter="18"></mat-spinner>
          } @else {
            Sign in
          }
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .login-bg {
        min-height: 100vh; display: grid; place-items: center;
        background: linear-gradient(135deg, #f6f9fb, #e6faf7);
      }
      .login-card {
        background: #fff; border: 1px solid rgba(15,23,42,0.08);
        border-radius: 16px; padding: 2rem; width: min(420px, 92vw);
        display: flex; flex-direction: column; gap: .75rem;
        box-shadow: 0 12px 48px rgba(15,23,42,0.08);
      }
      h1 { font-size: 1.5rem; margin: 0 0 .25rem; }
      p { color: #475569; margin: 0 0 1rem; }
      .error { color: #b91c1c; margin: 0; }
      button[type="submit"] { height: 44px; }
    `,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set(res.message ?? 'Invalid credentials');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message ?? 'Login failed');
      },
    });
  }
}
