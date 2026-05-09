import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.scss'],
})
export class SkillFormComponent implements OnInit {
  form!: FormGroup;
  editId: string | null = null;
  loading = false;
  saving = false;

  readonly levels = [
    { value: 1, label: '1 — Beginner' },
    { value: 2, label: '2 — Elementary' },
    { value: 3, label: '3 — Intermediate' },
    { value: 4, label: '4 — Advanced' },
    { value: 5, label: '5 — Expert' },
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
      category: ['', Validators.required],
      level: [3, Validators.required],
      yearsOfExperience: [0, [Validators.required, Validators.min(0)]],
      icon: [''],
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
    this.cv.getSkillById(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.form.patchValue({ ...res.data, icon: res.data.icon ?? '' });
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
    const payload = { ...val, icon: val.icon || null };

    this.saving = true;
    const req = this.editId
      ? this.cv.updateSkill(this.editId, payload)
      : this.cv.createSkill(payload);

    req.subscribe({
      next: () => {
        this.ui.success(this.editId ? 'Skill updated.' : 'Skill added.');
        this.router.navigate(['/cv/skills']);
      },
      error: () => {
        this.ui.error('Failed to save skill.');
        this.saving = false;
      },
    });
  }

  back(): void {
    this.router.navigate(['/cv/skills']);
  }
}
