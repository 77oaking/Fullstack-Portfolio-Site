import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AboutService } from '../../services/portfolio-resources';
import { StringListInputComponent } from '../../shared/string-list-input.component';

@Component({
  selector: 'app-about-page',
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
          <h1 class="page-title">About section</h1>
          <p class="page-subtitle">A longer story, key facts, your values.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="card">
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Heading</mat-label>
            <input matInput formControlName="heading" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Kicker (small overline)</mat-label>
            <input matInput formControlName="kicker" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Image URL</mat-label>
          <input matInput formControlName="imageUrl" />
        </mat-form-field>

        <h3>Paragraphs</h3>
        <div formArrayName="paragraphs">
          @for (p of paragraphs.controls; let i = $index; track i) {
            <div class="row" style="align-items:start">
              <mat-form-field appearance="outline">
                <mat-label>Paragraph {{ i + 1 }}</mat-label>
                <textarea matInput rows="3" [formControlName]="i"></textarea>
              </mat-form-field>
              <button mat-icon-button color="warn" type="button" (click)="removeParagraph(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        </div>
        <button mat-stroked-button type="button" (click)="addParagraph()">
          <mat-icon>add</mat-icon> Add paragraph
        </button>

        <h3 style="margin-top: 1.5rem">Facts (key/value)</h3>
        <div formArrayName="facts">
          @for (g of facts.controls; let i = $index; track i) {
            <div class="row" [formGroupName]="i" style="align-items:start">
              <mat-form-field appearance="outline">
                <mat-label>Label</mat-label>
                <input matInput formControlName="label" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Value</mat-label>
                <input matInput formControlName="value" />
              </mat-form-field>
              <button mat-icon-button color="warn" type="button" (click)="removeFact(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        </div>
        <button mat-stroked-button type="button" (click)="addFact()">
          <mat-icon>add</mat-icon> Add fact
        </button>

        <div style="margin-top: 1.5rem">
          <app-string-list label="Values (short words)" formControlName="values"></app-string-list>
        </div>

        <div class="btn-row" style="margin-top: 2rem">
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving…' : 'Save about' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class AboutPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AboutService);
  private readonly snack = inject(MatSnackBar);

  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    heading: ['About me', Validators.required],
    kicker: [''],
    imageUrl: [''],
    paragraphs: this.fb.array<ReturnType<FormBuilder['control']>>([]),
    facts: this.fb.array<FormGroup>([]),
    values: this.fb.control<string[]>([]),
  });

  get paragraphs(): FormArray { return this.form.get('paragraphs') as FormArray; }
  get facts(): FormArray<FormGroup> { return this.form.get('facts') as FormArray<FormGroup>; }

  ngOnInit(): void {
    this.api.get().subscribe((res) => {
      const a = res.data;
      if (!a) return;
      this.form.patchValue({
        heading: a.heading,
        kicker: a.kicker ?? '',
        imageUrl: a.imageUrl ?? '',
        values: a.values ?? [],
      });
      this.paragraphs.clear();
      (a.paragraphs ?? []).forEach((p) => this.paragraphs.push(this.fb.control(p)));
      this.facts.clear();
      (a.facts ?? []).forEach((f) => this.facts.push(this.factGroup(f)));
    });
  }

  private factGroup(v: { label?: string; value?: string } = {}) {
    return this.fb.nonNullable.group({
      label: [v.label ?? '', Validators.required],
      value: [v.value ?? '', Validators.required],
    });
  }

  addParagraph(): void { this.paragraphs.push(this.fb.control('')); }
  removeParagraph(i: number): void { this.paragraphs.removeAt(i); }
  addFact(): void { this.facts.push(this.factGroup()); }
  removeFact(i: number): void { this.facts.removeAt(i); }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.api.upsert(this.form.getRawValue() as never).subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open('About saved', 'Dismiss', { duration: 2500 });
      },
      error: () => this.saving.set(false),
    });
  }
}
