import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminService } from '../../services/admin/admin.service';
import { UiService } from '../../services/common/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  readonly form: FormGroup;
  loading = false;

  constructor(
    fb: FormBuilder,
    private readonly admin: AdminService,
    private readonly ui: UiService,
    private readonly router: Router,
  ) {
    this.form = fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const { username, password } = this.form.value;
    this.admin.login(username, password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.ui.success('Welcome back.');
          this.router.navigate(['/']);
        } else {
          this.ui.error(res.message ?? 'Login failed');
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message ?? 'Login failed';
        this.ui.error(msg);
      },
    });
  }
}
