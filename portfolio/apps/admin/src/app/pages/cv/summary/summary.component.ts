import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CvService } from '../../../services/common/cv.service';
import { UiService } from '../../../services/common/ui.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cv: CvService,
    private readonly ui: UiService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      text: ['', Validators.required],
    });
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.cv.getSummary().subscribe({
      next: (res) => {
        if (res.data) {
          this.form.patchValue({ text: res.data.text });
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
    this.cv.updateSummary(this.form.value.text).subscribe({
      next: () => {
        this.ui.success('Summary saved.');
        this.saving = false;
      },
      error: () => {
        this.ui.error('Failed to save summary.');
        this.saving = false;
      },
    });
  }
}
