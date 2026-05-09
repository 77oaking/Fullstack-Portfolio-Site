import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CvService } from '../../../../services/common/cv.service';
import { UiService } from '../../../../services/common/ui.service';

@Component({
  selector: 'app-award-form',
  templateUrl: './award-form.component.html',
  styleUrls: ['./award-form.component.scss'],
})
export class AwardFormComponent implements OnInit {
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
      title: ['', Validators.required],
      issuer: ['', Validators.required],
      date: ['', Validators.required],
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
    this.cv.getAwardById(id).subscribe({
      next: (res) => {
        if (res.data) {
          const d = res.data;
          this.form.patchValue({
            ...d,
            date: d.date ? d.date.substring(0, 10) : '',
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
    const payload = { ...val, description: val.description || null };

    this.saving = true;
    const req = this.editId
      ? this.cv.updateAward(this.editId, payload)
      : this.cv.createAward(payload);

    req.subscribe({
      next: () => {
        this.ui.success(this.editId ? 'Award updated.' : 'Award added.');
        this.router.navigate(['/cv/awards']);
      },
      error: () => {
        this.ui.error('Failed to save award.');
        this.saving = false;
      },
    });
  }

  back(): void {
    this.router.navigate(['/cv/awards']);
  }
}
