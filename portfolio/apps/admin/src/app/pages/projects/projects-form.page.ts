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

import { ProjectsService } from '../../services/portfolio-resources';
import { StringListInputComponent } from '../../shared/string-list-input.component';

@Component({
  selector: 'app-projects-form',
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
        <div><h1 class="page-title">{{ id() ? 'Edit project' : 'New project' }}</h1></div>
        <a mat-stroked-button routerLink="/projects"><mat-icon>arrow_back</mat-icon> Back</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="card">
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Slug (url-friendly)</mat-label>
            <input matInput formControlName="slug" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <input matInput formControlName="category" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Summary (one or two lines)</mat-label>
          <textarea matInput rows="2" formControlName="summary"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description (markdown supported)</mat-label>
          <textarea matInput rows="6" formControlName="description"></textarea>
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Cover image URL</mat-label>
            <input matInput formControlName="coverImage" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Live URL</mat-label>
            <input matInput formControlName="liveUrl" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Repository URL</mat-label>
            <input matInput formControlName="repoUrl" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Case study URL</mat-label>
            <input matInput formControlName="caseStudyUrl" />
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <input matInput formControlName="role" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Team</mat-label>
            <input matInput formControlName="team" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Start date</mat-label>
            <input matInput formControlName="startDate" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>End date</mat-label>
            <input matInput formControlName="endDate" />
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="completed">Completed</mat-option>
              <mat-option value="in-progress">In progress</mat-option>
              <mat-option value="archived">Archived</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Order</mat-label>
            <input matInput type="number" formControlName="order" />
          </mat-form-field>
          <mat-checkbox formControlName="featured">Featured</mat-checkbox>
        </div>

        <app-string-list label="Tech stack" formControlName="techStack"></app-string-list>
        <div style="margin-top:1rem">
          <app-string-list label="Gallery image URLs" formControlName="gallery"></app-string-list>
        </div>

        <div class="btn-row" style="margin-top:2rem">
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ProjectsFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ProjectsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly id = signal<string | null>(null);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],
    summary: [''],
    description: [''],
    coverImage: [''],
    liveUrl: [''],
    repoUrl: [''],
    caseStudyUrl: [''],
    category: [''],
    role: [''],
    team: [''],
    startDate: [''],
    endDate: [''],
    status: ['completed'],
    featured: [false],
    order: [0],
    techStack: this.fb.control<string[]>([]),
    gallery: this.fb.control<string[]>([]),
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
        this.router.navigate(['/projects']);
      },
      error: () => this.saving.set(false),
    });
  }
}
