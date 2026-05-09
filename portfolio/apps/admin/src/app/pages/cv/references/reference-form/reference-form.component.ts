import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';

@Component({
  selector: 'app-reference-form',
  templateUrl: './reference-form.component.html',
  styleUrls: ['./reference-form.component.scss'],
})
export class ReferenceFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading = false;
  saving = false;

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
      position: ['', Validators.required],
      company: ['', Validators.required],
      email: ['', Validators.email],
      phone: [''],
      relationship: [''],
      order: [0],
      visible: [true],
    });

    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.loadExisting(this.editId);
    }
  }

  private loadExisting(id: string): void {
    this.loading = true;
    this.cv.getReferenceById(id).subscribe({
      next: (res) => {
        if (res.data) {
          const d = res.data;
          this.form.patchValue({
            ...d,
            email: d.email ?? '',
            phone: d.phone ?? '',
            relationship: d.relationship ?? '',
          });
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
    const val = this.form.value;
    const payload = {
      ...val,
      email: val.email || null,
      phone: val.phone || null,
      relationship: val.relationship || null,
    };

    this.saving = true;
    const req = this.editId
      ? this.cv.updateReference(this.editId, payload)
      : this.cv.createReference(payload);

    req.subscribe({
      next: () => {
        this.ui.success(this.editId ? 'Reference updated.' : 'Reference added.');
        this.router.navigate(['/cv/references']);
      },
      error: () => {
        this.ui.error('Failed to save reference.');
        this.saving = false;
      },
    });
  }

  back(): void {
    this.router.navigate(['/cv/references']);
  }
}
