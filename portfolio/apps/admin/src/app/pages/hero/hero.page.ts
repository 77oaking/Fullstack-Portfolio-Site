import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HeroService } from '../../services/portfolio-resources';
import { StringListInputComponent } from '../../shared/string-list-input.component';

@Component({
  selector: 'app-hero-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    StringListInputComponent,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Hero section</h1>
          <p class="page-subtitle">The first thing visitors see — headline, CTA, metrics.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="card">
        <mat-form-field appearance="outline">
          <mat-label>Badge (e.g. "Available for hire")</mat-label>
          <input matInput formControlName="badge" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Headline</mat-label>
          <input matInput formControlName="headline" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Subhead</mat-label>
          <textarea matInput rows="3" formControlName="subhead"></textarea>
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Primary CTA label</mat-label>
            <input matInput formControlName="primaryCtaLabel" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Primary CTA URL</mat-label>
            <input matInput formControlName="primaryCtaUrl" />
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Secondary CTA label</mat-label>
            <input matInput formControlName="secondaryCtaLabel" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Secondary CTA URL</mat-label>
            <input matInput formControlName="secondaryCtaUrl" />
          </mat-form-field>
        </div>

        <h3>Metrics</h3>
        <div formArrayName="metrics">
          @for (g of metrics.controls; let i = $index; track i) {
            <div class="row" [formGroupName]="i" style="align-items:start">
              <mat-form-field appearance="outline">
                <mat-label>Value (e.g. "5+")</mat-label>
                <input matInput formControlName="value" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Label (e.g. "Years experience")</mat-label>
                <input matInput formControlName="label" />
              </mat-form-field>
              <button mat-icon-button color="warn" type="button" (click)="removeMetric(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        </div>
        <button mat-stroked-button type="button" (click)="addMetric()">
          <mat-icon>add</mat-icon> Add metric
        </button>

        <div style="margin-top:1.5rem">
          <app-string-list label="Tech marquee (logos / names rolling under hero)" formControlName="techMarquee"></app-string-list>
        </div>

        <div class="btn-row" style="margin-top: 2rem">
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving…' : 'Save hero' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class HeroPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(HeroService);
  private readonly snack = inject(MatSnackBar);

  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    badge: [''],
    headline: ['', Validators.required],
    subhead: [''],
    primaryCtaLabel: ['Get in touch'],
    primaryCtaUrl: ['#contact'],
    secondaryCtaLabel: [''],
    secondaryCtaUrl: [''],
    metrics: this.fb.array<FormGroup>([]),
    techMarquee: this.fb.control<string[]>([]),
  });

  get metrics(): FormArray<FormGroup> {
    return this.form.get('metrics') as FormArray<FormGroup>;
  }

  ngOnInit(): void {
    this.api.get().subscribe((res) => {
      const h = res.data;
      if (!h) return;
      this.form.patchValue({
        badge: h.badge ?? '',
        headline: h.headline,
        subhead: h.subhead,
        primaryCtaLabel: h.primaryCtaLabel,
        primaryCtaUrl: h.primaryCtaUrl,
        secondaryCtaLabel: h.secondaryCtaLabel ?? '',
        secondaryCtaUrl: h.secondaryCtaUrl ?? '',
        techMarquee: h.techMarquee ?? [],
      });
      this.metrics.clear();
      (h.metrics ?? []).forEach((m) => this.metrics.push(this.metricGroup(m)));
    });
  }

  private metricGroup(v: { value?: string; label?: string } = {}) {
    return this.fb.nonNullable.group({
      value: [v.value ?? '', Validators.required],
      label: [v.label ?? '', Validators.required],
    });
  }

  addMetric(): void {
    this.metrics.push(this.metricGroup());
  }
  removeMetric(i: number): void {
    this.metrics.removeAt(i);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.api.upsert(this.form.getRawValue() as never).subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open('Hero saved', 'Dismiss', { duration: 2500 });
      },
      error: () => this.saving.set(false),
    });
  }
}
