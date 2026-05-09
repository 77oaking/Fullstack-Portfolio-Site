import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Profile } from '@portfolio/shared-types';

import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section id="contact" class="section contact">
      <div class="container grid">
        <div class="text">
          <span class="section-kicker">Contact</span>
          <h2 class="section-title">Let's build something together</h2>
          <p class="section-subtitle">Drop a line — I read every message and reply within a couple of business days.</p>

          <ul class="info">
            @if (profile?.email) {
              <li>
                <span class="label">Email</span>
                <a [href]="'mailto:' + profile?.email">{{ profile?.email }}</a>
              </li>
            }
            @if (profile?.phone) {
              <li><span class="label">Phone</span><span>{{ profile?.phone }}</span></li>
            }
            @if (profile?.location) {
              <li><span class="label">Based in</span><span>{{ profile?.location }}</span></li>
            }
          </ul>

          @if ((profile?.socials?.length ?? 0) > 0) {
            <div class="socials">
              @for (s of profile?.socials; track s.url) {
                <a [href]="s.url" target="_blank" rel="noopener">{{ s.label }}</a>
              }
            </div>
          }
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="card form">
          <div class="field">
            <label for="name">Name</label>
            <input id="name" formControlName="name" placeholder="Your name" />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" placeholder="you@example.com" />
          </div>
          <div class="field">
            <label for="subject">Subject</label>
            <input id="subject" formControlName="subject" placeholder="What's this about?" />
          </div>
          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" rows="5" formControlName="message" placeholder="Tell me a little about your project."></textarea>
          </div>
          <input type="text" formControlName="honeypot" tabindex="-1" autocomplete="off" class="honeypot" />

          <button class="btn btn-primary" type="submit" [disabled]="form.invalid || sending()">
            {{ sending() ? 'Sending…' : (sent() ? 'Sent ✓' : 'Send message') }}
          </button>
          @if (errorMsg()) { <p class="err">{{ errorMsg() }}</p> }
        </form>
      </div>
    </section>
  `,
  styles: [
    `
      .contact { background: var(--bg-alt); }
      .grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 3rem; align-items: start; }
      .info { list-style: none; margin: 0; padding: 0; display: grid; gap: .75rem; margin-top: 1.5rem; }
      .info li { display: flex; gap: 1rem; align-items: baseline; }
      .info .label { color: var(--text-3); font-size: .8125rem; text-transform: uppercase; letter-spacing: .06em; min-width: 80px; }
      .info a { color: var(--accent-1-dark); font-weight: 600; }
      .socials { display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }
      .socials a { color: var(--text-2); font-weight: 600; }
      .socials a:hover { color: var(--accent-1-dark); }
      .form { padding: 1.75rem; }
      .field { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 4px; }
      .field label { font-size: .8125rem; font-weight: 600; color: var(--text-2); }
      .field input, .field textarea {
        width: 100%; padding: .75rem 1rem; border-radius: var(--radius);
        border: 1px solid var(--border); background: #fff;
        font-family: inherit; font-size: 1rem; color: var(--text-1);
        transition: border-color .15s, box-shadow .15s;
      }
      .field textarea { resize: vertical; min-height: 120px; }
      .honeypot { display: none; }
      .btn-primary { width: 100%; height: 52px; }
      .err { color: #b91c1c; margin: .75rem 0 0; }
      @media (max-width: 880px) { .grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class ContactComponent {
  @Input() profile: Profile | null = null;

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PortfolioService);

  readonly sending = signal(false);
  readonly sent = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(2)]],
    message: ['', [Validators.required, Validators.minLength(2)]],
    honeypot: [''],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.sending.set(true);
    this.errorMsg.set(null);
    this.api.submitContact(this.form.getRawValue()).subscribe({
      next: () => {
        this.sending.set(false);
        this.sent.set(true);
        this.form.reset();
      },
      error: (err) => {
        this.sending.set(false);
        this.errorMsg.set(err?.error?.message ?? 'Could not send. Please try again.');
      },
    });
  }
}
