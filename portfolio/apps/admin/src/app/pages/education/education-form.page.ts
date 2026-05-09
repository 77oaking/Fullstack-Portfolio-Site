import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EducationService } from '../../services/portfolio-resources';
import { StringListInputComponent } from '../../shared/string-list-input.component';

@Component({
  selector: 'app-education-form',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatCheckboxModule,
    MatButtonModule, MatIconModule,
    StringListInputComponent,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h1 class="page-title">{{ id() ? 'Edit education' : 'New education' }}</h1></div>
        <a mat-stroked-button routerLink="/education"><mat-icon>arrow_back</mat-icon> Back</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="card">
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Institution</mat-label>
            <input matInput formControlName="institution" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Institution URL</mat-label>
            <input matInput formControlName="institutionUrl" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Institution logo URL</mat-label>
            <input matInput formControlName="institutionLogo" />
          </mat-form-field>
        </div>
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Degree</mat-label>
            <input matInput formControlName="degree" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Field of study</mat-label>
            <input matInput formControlName="fieldOfStudy" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" />
          </mat-form-field>
        </div>
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Start date</mat-label>
            <input matInput formControlName="startDate" placeholder="2016-01" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>End date</mat-label>
            <input matInput formControlName="endDate" placeholder="2020-06" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>GPA / grade</mat-label>
            <input matInput formControlName="gpa" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Order</mat-label>
            <input matInput type="number" formControlName="order" />
          </mat-form-field>
        </div>
        <div class="field">
          <mat-checkbox formControlName="current">Currently studying here</mat-checkbox>
        </div>
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput rows="3" formControlName="description"></textarea>
        </mat-form-field>
        <app-string-list label="Achievements" formControlName="achievements"></app-string-list>

        <div class="btn-row" style="margin-top:2rem">
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class EducationFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(EducationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly id = signal<string | null>(null);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    institution: ['', Validators.required],
    institutionUrl: [''],
    institutionLogo: [''],
    degree: ['', Validators.required],
    fieldOfStudy: [''],
    location: [''],
    startDate: ['', Validators.required],
    endDate: [''],
    current: [false],
    gpa: [''],
    description: [''],
    achievements: this.fb.control<string[]>([]),
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
      next: () => {
        this.saving.set(false);
        this.snack.open('Saved', 'Dismiss', { duration: 2500 });
        this.router.navigate(['/education']);
      },
      error: () => this.saving.set(false),
    });
  }
}
