import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';

@Component({
  selector: 'app-certification-form',
  templateUrl: './certification-form.component.html',
  styleUrls: ['./certification-form.component.scss'],
})
export class CertificationFormComponent implements OnInit {
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
      issuer: ['', Validators.required],
      issueDate: ['', Validators.required],
      expiryDate: [''],
      credentialId: [''],
      credentialUrl: [''],
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
    this.cv.getCertificationById(id).subscribe({
      next: (res) => {
        if (res.data) {
          const d = res.data;
          this.form.patchValue({
            ...d,
            issueDate: d.issueDate ? d.issueDate.substring(0, 10) : '',
            expiryDate: d.expiryDate ? d.expiryDate.substring(0, 10) : '',
            credentialId: d.credentialId ?? '',
            credentialUrl: d.credentialUrl ?? '',
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
      expiryDate: val.expiryDate || null,
      credentialId: val.credentialId || null,
      credentialUrl: val.credentialUrl || null,
    };

    this.saving = true;
    const req = this.editId
      ? this.cv.updateCertification(this.editId, payload)
      : this.cv.createCertification(payload);

    req.subscribe({
      next: () => {
        this.ui.success(this.editId ? 'Certification updated.' : 'Certification added.');
        this.router.navigate(['/cv/certifications']);
      },
      error: () => {
        this.ui.error('Failed to save certification.');
        this.saving = false;
      },
    });
  }

  back(): void {
    this.router.navigate(['/cv/certifications']);
  }
}
