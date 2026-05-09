import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ExperienceService } from '../../services/portfolio-resources';
import { StringListInputComponent } from '../../shared/string-list-input.component';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatButtonModule, MatIconModule,
    StringListInputComponent,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ id() ? 'Edit experience' : 'New experience' }}</h1>
        </div>
        <a mat-stroked-button routerLink="/experience"><mat-icon>arrow_back</mat-icon> Back</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="card">
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <input matInput formControlName="role" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Company</mat-label>
            <input matInput formControlName="company" />
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Company URL</mat-label>
            <input matInput formControlName="companyUrl" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Company logo URL</mat-label>
            <input matInput formControlName="companyLogo" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" />
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Type</mat-label>
            <mat-select formControlName="type">
              <mat-option value="full-time">Full-time</mat-option>
              <mat-option value="part-time">Part-time</mat-option>
              <mat-option value="contract">Contract</mat-option>
              <mat-option value="freelance">Freelance</mat-option>
              <mat-option value="internship">Internship</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Start date (YYYY-MM)</mat-label>
            <input matInput formControlName="startDate" placeholder="2023-04" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>End date (YYYY-MM)</mat-label>
            <input matInput formControlName="endDate" placeholder="2024-12" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Order</mat-label>
            <input matInput type="number" formControlName="order" />
          </mat-form-field>
        </div>

        <div class="field">
          <mat-checkbox formControlName="current">I currently work here</mat-checkbox>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput rows="4" formControlName="description"></textarea>
        </mat-form-field>

        <app-string-list label="Achievements" formControlName="achievements"></app-string-list>
        <div style="margin-top:1rem">
          <app-string-list label="Tech stack" formControlName="techStack"></app-string-list>
        </div>

        <div class="btn-row" style="margin-top: 2rem">
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ExperienceFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ExperienceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly id = signal<string | null>(null);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    role: ['', Validators.required],
    company: ['', Validators.required],
    companyUrl: [''],
    companyLogo: [''],
    location: [''],
    type: ['full-time'],
    startDate: ['', Validators.required],
    endDate: [''],
    current: [false],
    description: [''],
    achievements: this.fb.control<string[]>([]),
    techStack: this.fb.control<string[]>([]),
    order: [0],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.api.one(id).subscribe((res) => {
        if (res.data) this.form.patchValue(res.data as never);
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const raw = this.form.getRawValue();
    const obs = this.id() ? this.api.update(this.id() as string, raw as never) : this.api.create(raw as never);
    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open('Saved', 'Dismiss', { duration: 2500 });
        this.router.navigate(['/experience']);
      },
      error: () => this.saving.set(false),
    });
  }
}
