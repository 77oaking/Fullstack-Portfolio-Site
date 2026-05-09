import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProfileService } from '../../services/portfolio-resources';
import { StringListInputComponent } from '../../shared/string-list-input.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    StringListInputComponent,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Profile</h1>
          <p class="page-subtitle">Your name, title, bio, contact info and socials.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="card">
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Full name</mat-label>
            <input matInput formControlName="fullName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Short name (display)</mat-label>
            <input matInput formControlName="shortName" />
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Title (e.g. Full Stack Developer)</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Tagline (one sentence)</mat-label>
            <input matInput formControlName="tagline" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Short bio (used in hero/about preview)</mat-label>
          <textarea matInput rows="2" formControlName="shortBio"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Long bio</mat-label>
          <textarea matInput rows="6" formControlName="bio"></textarea>
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Avatar URL</mat-label>
            <input matInput formControlName="avatarUrl" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Cover URL</mat-label>
            <input matInput formControlName="coverUrl" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Resume URL</mat-label>
            <input matInput formControlName="resumeUrl" />
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phone" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Years of experience</mat-label>
            <input matInput type="number" formControlName="yearsOfExperience" />
          </mat-form-field>
        </div>

        <div class="field">
          <mat-checkbox formControlName="availableForWork">Available for new work</mat-checkbox>
        </div>

        <app-string-list label="Highlights (short bullet points)" formControlName="highlights"></app-string-list>

        <h3 style="margin-top: 1.5rem">Social links</h3>
        <div formArrayName="socials">
          @for (g of socials.controls; let i = $index; track i) {
            <div class="row" [formGroupName]="i" style="align-items:start">
              <mat-form-field appearance="outline">
                <mat-label>Platform</mat-label>
                <input matInput formControlName="platform" placeholder="github, linkedin, …" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Label</mat-label>
                <input matInput formControlName="label" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>URL</mat-label>
                <input matInput formControlName="url" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Icon (optional)</mat-label>
                <input matInput formControlName="icon" />
              </mat-form-field>
              <button mat-icon-button color="warn" type="button" (click)="removeSocial(i)" aria-label="Remove">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        </div>
        <button mat-stroked-button type="button" (click)="addSocial()">
          <mat-icon>add</mat-icon> Add social
        </button>

        <div class="btn-row" style="margin-top: 2rem">
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving…' : 'Save profile' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ProfileService);
  private readonly snack = inject(MatSnackBar);

  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    shortName: ['', Validators.required],
    title: ['', Validators.required],
    tagline: [''],
    bio: [''],
    shortBio: [''],
    avatarUrl: [''],
    coverUrl: [''],
    resumeUrl: [''],
    location: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    yearsOfExperience: [0],
    availableForWork: [true],
    highlights: this.fb.control<string[]>([]),
    socials: this.fb.array<FormGroup>([]),
  });

  get socials(): FormArray<FormGroup> {
    return this.form.get('socials') as FormArray<FormGroup>;
  }

  ngOnInit(): void {
    this.api.get().subscribe((res) => {
      const p = res.data;
      if (!p) return;
      this.form.patchValue({
        fullName: p.fullName,
        shortName: p.shortName,
        title: p.title,
        tagline: p.tagline,
        bio: p.bio,
        shortBio: p.shortBio,
        avatarUrl: p.avatarUrl,
        coverUrl: p.coverUrl ?? '',
        resumeUrl: p.resumeUrl ?? '',
        location: p.location,
        email: p.email,
        phone: p.phone ?? '',
        yearsOfExperience: p.yearsOfExperience ?? 0,
        availableForWork: !!p.availableForWork,
        highlights: p.highlights ?? [],
      });
      this.socials.clear();
      (p.socials ?? []).forEach((s) => this.socials.push(this.socialGroup(s)));
    });
  }

  private socialGroup(value: { platform?: string; label?: string; url?: string; icon?: string } = {}) {
    return this.fb.nonNullable.group({
      platform: [value.platform ?? '', Validators.required],
      label: [value.label ?? '', Validators.required],
      url: [value.url ?? '', Validators.required],
      icon: [value.icon ?? ''],
    });
  }

  addSocial(): void {
    this.socials.push(this.socialGroup());
  }
  removeSocial(i: number): void {
    this.socials.removeAt(i);
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.api.upsert(this.form.getRawValue() as never).subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open('Profile saved', 'Dismiss', { duration: 2500 });
      },
      error: () => this.saving.set(false),
    });
  }
}
