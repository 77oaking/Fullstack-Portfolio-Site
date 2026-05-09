import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';

@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss'],
})
export class LanguageFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading = false;
  saving = false;

  readonly proficiencies = [
    { value: 'native', label: 'Native' },
    { value: 'fluent', label: 'Fluent' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'basic', label: 'Basic' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly cv: CvService,
    private readonly ui: UiService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      proficiency: ['intermediate', Validators.required],
      order: [0],
    });

    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.loadExisting(this.editId);
    }
  }

  private loadExisting(id: string): void {
    this.loading = true;
    this.cv.getLanguageById(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.form.patchValue(res.data);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const req = this.editId
      ? this.cv.updateLanguage(this.editId, this.form.value)
      : this.cv.createLanguage(this.form.value);

    req.subscribe({
      next: () => {
        this.ui.success(this.editId ? 'Language updated.' : 'Language added.');
        this.router.navigate(['/cv/languages']);
      },
      error: () => {
        this.ui.error('Failed to save language.');
        this.saving = false;
      },
    });
  }

  back(): void {
    this.router.navigate(['/cv/languages']);
  }
}
