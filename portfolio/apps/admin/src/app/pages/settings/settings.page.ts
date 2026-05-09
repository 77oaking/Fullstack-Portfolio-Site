import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SettingsService } from '../../services/portfolio-resources';
import { StringListInputComponent } from '../../shared/string-list-input.component';

@Component({
  selector: 'app-settings-page',
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
          <h1 class="page-title">Site settings</h1>
          <p class="page-subtitle">Title, navigation, SEO, footer, feature toggles.</p>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="save()" class="card">
        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Site title</mat-label>
            <input matInput formControlName="siteTitle" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Active theme key</mat-label>
            <input matInput formControlName="activeTheme" placeholder="default" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Site description</mat-label>
          <textarea matInput rows="2" formControlName="siteDescription"></textarea>
        </mat-form-field>

        <h3>Navigation items</h3>
        <div formArrayName="navItems">
          @for (g of navItems.controls; let i = $index; track i) {
            <div class="row" [formGroupName]="i" style="align-items:start">
              <mat-form-field appearance="outline">
                <mat-label>Label</mat-label>
                <input matInput formControlName="label" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Href (e.g. #about)</mat-label>
                <input matInput formControlName="href" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Order</mat-label>
                <input matInput type="number" formControlName="order" />
              </mat-form-field>
              <button mat-icon-button color="warn" type="button" (click)="removeNav(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
        </div>
        <button mat-stroked-button type="button" (click)="addNav()">
          <mat-icon>add</mat-icon> Add nav item
        </button>

        <h3 style="margin-top:1.5rem" formGroupName="footer">Footer</h3>
        <div class="row" formGroupName="footer">
          <mat-form-field appearance="outline">
            <mat-label>Copyright</mat-label>
            <input matInput formControlName="copyright" />
          </mat-form-field>
          <mat-checkbox formControlName="showSocials">Show socials in footer</mat-checkbox>
        </div>

        <h3 style="margin-top:1.5rem">SEO</h3>
        <div formGroupName="seo">
          <div class="row">
            <mat-form-field appearance="outline">
              <mat-label>Default title</mat-label>
              <input matInput formControlName="defaultTitle" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>OG image URL</mat-label>
              <input matInput formControlName="ogImage" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Twitter handle</mat-label>
              <input matInput formControlName="twitterHandle" />
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline">
            <mat-label>Default description</mat-label>
            <textarea matInput rows="2" formControlName="defaultDescription"></textarea>
          </mat-form-field>
          <app-string-list label="Keywords" formControlName="keywords"></app-string-list>
        </div>

        <h3 style="margin-top:1.5rem">Feature toggles</h3>
        <div class="row" formGroupName="features" style="flex-wrap:wrap">
          @for (key of featureKeys; track key) {
            <mat-checkbox [formControlName]="key">{{ readableFeature(key) }}</mat-checkbox>
          }
        </div>

        <div class="btn-row" style="margin-top: 2rem">
          <button mat-flat-button color="primary" type="submit" [disabled]="saving()">
            {{ saving() ? 'Saving…' : 'Save settings' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class SettingsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(SettingsService);
  private readonly snack = inject(MatSnackBar);

  readonly saving = signal(false);
  readonly featureKeys = [
    'showHero', 'showAbout', 'showExperience', 'showEducation', 'showSkills',
    'showProjects', 'showServices', 'showTestimonials', 'showCertifications',
    'showAchievements', 'showBlog', 'showContact',
  ] as const;

  readonly form = this.fb.nonNullable.group({
    siteTitle: ['My Portfolio', Validators.required],
    siteDescription: [''],
    activeTheme: ['default'],
    navItems: this.fb.array<FormGroup>([]),
    footer: this.fb.nonNullable.group({
      copyright: [''],
      showSocials: [true],
    }),
    seo: this.fb.nonNullable.group({
      defaultTitle: [''],
      defaultDescription: [''],
      ogImage: [''],
      twitterHandle: [''],
      keywords: this.fb.control<string[]>([]),
    }),
    features: this.fb.nonNullable.group(
      Object.fromEntries(this.featureKeys.map((k) => [k, true])) as Record<
        (typeof this.featureKeys)[number],
        boolean
      >,
    ),
  });

  get navItems(): FormArray<FormGroup> { return this.form.get('navItems') as FormArray<FormGroup>; }

  readableFeature(k: string): string {
    return k.replace(/^show/, '').replace(/([A-Z])/g, ' $1').trim();
  }

  ngOnInit(): void {
    this.api.get().subscribe((res) => {
      const s = res.data;
      if (!s) return;
      this.form.patchValue({
        siteTitle: s.siteTitle,
        siteDescription: s.siteDescription,
        activeTheme: s.activeTheme,
        footer: {
          copyright: s.footer?.copyright ?? '',
          showSocials: s.footer?.showSocials ?? true,
        },
        seo: {
          defaultTitle: s.seo?.defaultTitle ?? '',
          defaultDescription: s.seo?.defaultDescription ?? '',
          ogImage: s.seo?.ogImage ?? '',
          twitterHandle: s.seo?.twitterHandle ?? '',
          keywords: s.seo?.keywords ?? [],
        },
        features: { ...s.features },
      });
      this.navItems.clear();
      (s.navItems ?? []).forEach((n) => this.navItems.push(this.navGroup(n)));
    });
  }

  private navGroup(v: { label?: string; href?: string; order?: number } = {}) {
    return this.fb.nonNullable.group({
      label: [v.label ?? '', Validators.required],
      href: [v.href ?? '', Validators.required],
      order: [v.order ?? 0],
    });
  }

  addNav(): void { this.navItems.push(this.navGroup()); }
  removeNav(i: number): void { this.navItems.removeAt(i); }

  save(): void {
    this.saving.set(true);
    this.api.upsert(this.form.getRawValue() as never).subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open('Settings saved', 'Dismiss', { duration: 2500 });
      },
      error: () => this.saving.set(false),
    });
  }
}
