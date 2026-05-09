import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SkillsService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h1 class="page-title">{{ id() ? 'Edit category' : 'New category' }}</h1></div>
        <a mat-stroked-button routerLink="/skills"><mat-icon>arrow_back</mat-icon> Back</a>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="card">
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Category name (e.g. Frontend)</mat-label>
            <input matInput formControlName="name" />
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
          <textarea matInput rows="2" formControlName="description"></textarea>
        </mat-form-field>

        <h3>Skills in this category</h3>
        <div formArrayName="items">
          @for (g of items.controls; let i = $index; track i) {
            <div class="row" [formGroupName]="i" style="align-items:start">
              <mat-form-field appearance="outline">
                <mat-label>Skill name</mat-label>
                <input matInput formControlName="name" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Level (0–100)</mat-label>
                <input matInput type="number" formControlName="level" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Years of experience</mat-label>
                <input matInput type="number" formControlName="yearsOfExperience" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Icon (optional)</mat-label>
                <input matInput formControlName="icon" />
              </mat-form-field>
              <button mat-icon-button color="warn" type="button" (click)="removeItem(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        </div>
        <button mat-stroked-button type="button" (click)="addItem()">
          <mat-icon>add</mat-icon> Add skill
        </button>

        <div class="btn-row" style="margin-top:2rem">
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class SkillsFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(SkillsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly id = signal<string | null>(null);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    icon: [''],
    description: [''],
    order: [0],
    items: this.fb.array<FormGroup>([]),
  });

  get items(): FormArray<FormGroup> { return this.form.get('items') as FormArray<FormGroup>; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.api.one(id).subscribe((r) => {
        const c = r.data;
        if (!c) return;
        this.form.patchValue({
          name: c.name,
          icon: c.icon ?? '',
          description: c.description ?? '',
          order: c.order ?? 0,
        });
        this.items.clear();
        (c.items ?? []).forEach((it) => this.items.push(this.itemGroup(it)));
      });
    }
  }

  private itemGroup(v: { name?: string; level?: number; yearsOfExperience?: number; icon?: string } = {}) {
    return this.fb.nonNullable.group({
      name: [v.name ?? '', Validators.required],
      level: [v.level ?? 0],
      yearsOfExperience: [v.yearsOfExperience ?? 0],
      icon: [v.icon ?? ''],
    });
  }

  addItem(): void { this.items.push(this.itemGroup()); }
  removeItem(i: number): void { this.items.removeAt(i); }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const raw = this.form.getRawValue();
    const obs = this.id() ? this.api.update(this.id() as string, raw as never) : this.api.create(raw as never);
    obs.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open('Saved', 'Dismiss', { duration: 2500 });
        this.router.navigate(['/skills']);
      },
      error: () => this.saving.set(false),
    });
  }
}
