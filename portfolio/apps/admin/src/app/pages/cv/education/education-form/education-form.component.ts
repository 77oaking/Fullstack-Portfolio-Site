import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss'],
})
export class EducationFormComponent implements OnInit {
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
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      fieldOfStudy: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false],
      grade: [''],
      description: [''],
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
    this.cv.getEducationById(id).subscribe({
      next: (res) => {
        if (res.data) {
          const d = res.data;
          this.form.patchValue({
            ...d,
            startDate: d.startDate ? d.startDate.substring(0, 10) : '',
            endDate: d.endDate ? d.endDate.substring(0, 10) : '',
            current: !d.endDate,
            grade: d.grade ?? '',
            description: d.description ?? '',
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
      endDate: val.current ? null : val.endDate || null,
      grade: val.grade || null,
      description: val.description || null,
    };
    delete payload['current'];

    this.saving = true;
    const req = this.editId
      ? this.cv.updateEducation(this.editId, payload)
      : this.cv.createEducation(payload);

    req.subscribe({
      next: () => {
        this.ui.success(this.editId ? 'Education updated.' : 'Education added.');
        this.router.navigate(['/cv/education']);
      },
      error: () => {
        this.ui.error('Failed to save education.');
        this.saving = false;
      },
    });
  }

  back(): void {
    this.router.navigate(['/cv/education']);
  }
}
