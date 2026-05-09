import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ServicesService } from '../../services/portfolio-resources';
import { StringListInputComponent } from '../../shared/string-list-input.component';

@Component({
  selector: 'app-services-form',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    StringListInputComponent,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h1 class="page-title">{{ id() ? 'Edit service' : 'New service' }}</h1></div>
        <a mat-stroked-button routerLink="/services"><mat-icon>arrow_back</mat-icon> Back</a>
      </div>
      <form [formGroup]="form" (ngSubmit)="save()" class="card">
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Icon (optional)</mat-label>
            <input matInput formControlName="icon" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Order</mat-label>
            <input matInput type="number" formControlName="order" />
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput rows="4" formControlName="description"></textarea>
        </mat-form-field>
        <app-string-list label="Features" formControlName="features"></app-string-list>
        <div class="btn-row" style="margin-top:2rem">
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ServicesFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ServicesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly id = signal<string | null>(null);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    icon: [''],
    features: this.fb.control<string[]>([]),
    order: [0],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.api.one(id).subscribe((r) => r.data && this.form.patchValue(r.data as never));
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const raw = this.form.getRawValue();
    const obs = this.id() ? this.api.update(this.id() as string, raw as never) : this.api.create(raw as never);
    obs.subscribe({
      next: () => { this.saving.set(false); this.snack.open('Saved', 'Dismiss', { duration: 2500 }); this.router.navigate(['/services']); },
      error: () => this.saving.set(false),
    });
  }
}
