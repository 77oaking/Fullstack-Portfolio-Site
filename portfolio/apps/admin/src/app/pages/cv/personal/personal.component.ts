import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CvService } from '../../../services/common/cv.service';
import { UiService } from '../../../services/common/ui.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class PersonalComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  readonly maxPhotoSizeBytes = 5 * 1024 * 1024;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cv: CvService,
    private readonly ui: UiService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      headline: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      city: [''],
      country: [''],
      address: [''],
      website: [''],
      linkedin: [''],
      github: [''],
      photo: [''],
    });

    this.load();
  }

  private load(): void {
    this.loading = true;
    this.cv.getPersonal().subscribe({
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
    this.cv.updatePersonal(this.form.value).subscribe({
      next: () => {
        this.ui.success('Personal data saved.');
        this.saving = false;
      },
      error: () => {
        this.ui.error('Failed to save personal data.');
        this.saving = false;
      },
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.ui.error('Please select an image file.');
      input.value = '';
      return;
    }

    if (file.size > this.maxPhotoSizeBytes) {
      this.ui.error('Image is too large. Please keep it under 5 MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      this.form.patchValue({ photo: dataUrl });
    };
    reader.onerror = () => {
      this.ui.error('Failed to read selected image.');
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  clearPhoto(): void {
    this.form.patchValue({ photo: '' });
  }
}
