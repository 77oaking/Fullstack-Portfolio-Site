import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';

@Component({
  selector: 'app-experience-form',
  templateUrl: './experience-form.component.html',
  styleUrls: ['./experience-form.component.scss'],
})
export class ExperienceFormComponent implements OnInit {
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
      role: ['', Validators.required],
      company: ['', Validators.required],
      companyLogo: [''],
      location: [''],
      startDate: ['', Validators.required],
      endDate: [''],
      current: [false],
      summary: [''],
      bullets: this.fb.array([]),
      techStack: [''],
      order: [0],
      visible: [true],
    });

    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.loadExisting(this.editId);
    }
  }

  get bullets(): FormArray {
    return this.form.get('bullets') as FormArray;
  }

  addBullet(): void {
    this.bullets.push(this.fb.control(''));
  }

  removeBullet(index: number): void {
    this.bullets.removeAt(index);
  }

  private loadExisting(id: string): void {
    this.loading = true;
    this.cv.getExperienceById(id).subscribe({
      next: (res) => {
        if (res.data) {
          const d = res.data;
          this.form.patchValue({
            role: d.role,
            company: d.company,
            companyLogo: d.companyLogo ?? '',
            location: d.location,
            startDate: d.startDate ? d.startDate.substring(0, 10) : '',
            endDate: d.endDate ? d.endDate.substring(0, 10) : '',
            current: !d.endDate,
            summary: d.summary,
            techStack: d.techStack.join(', '),
            order: d.order,
            visible: d.visible,
          });
          d.bullets.forEach((b) => this.bullets.push(this.fb.control(b)));
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
      techStack: (val.techStack as string).split(',').map((s: string) => s.trim()).filter(Boolean),
      bullets: (val.bullets as string[]).filter(Boolean),
      endDate: val.current ? null : val.endDate || null,
      companyLogo: val.companyLogo || null,
    };
    delete payload['current'];

    this.saving = true;
    const req = this.editId
      ? this.cv.updateExperience(this.editId, payload)
      : this.cv.createExperience(payload);

    req.subscribe({
      next: () => {
        this.ui.success(this.editId ? 'Experience updated.' : 'Experience added.');
        this.router.navigate(['/cv/experience']);
      },
      error: () => {
        this.ui.error('Failed to save experience.');
        this.saving = false;
      },
    });
  }

  back(): void {
    this.router.navigate(['/cv/experience']);
  }
}
