import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectService } from '../../../services/common/project.service';
import { UiService } from '../../../services/common/ui.service';
import type { Project } from '@portfolio/shared-types';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent implements OnInit {
  form!: FormGroup;
  id: string | null = null;
  loading = false;

  readonly statuses = ['draft', 'published', 'archived'] as const;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: ProjectService,
    private readonly ui: UiService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      slug: ['', [Validators.required, Validators.maxLength(120)]],
      summary: ['', [Validators.required, Validators.maxLength(280)]],
      description: ['', Validators.required],
      coverImage: ['', Validators.required],
      gallery: this.fb.array<string>([]),
      tags: [''], // comma-separated string in the form, transformed on submit
      techStack: [''],
      links: this.fb.array<FormGroup>([]),
      featured: [false],
      order: [0],
      status: ['draft', Validators.required],
    });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.load(this.id);
  }

  get linksArray(): FormArray { return this.form.get('links') as FormArray; }

  addLink(label = '', url = ''): void {
    this.linksArray.push(this.fb.group({ label: [label], url: [url] }));
  }

  removeLink(idx: number): void {
    this.linksArray.removeAt(idx);
  }

  load(id: string): void {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (r) => {
        const p = r.data;
        if (!p) {
          this.ui.error('Project not found');
          this.loading = false;
          return;
        }
        this.form.patchValue({
          title: p.title,
          slug: p.slug,
          summary: p.summary,
          description: p.description,
          coverImage: p.coverImage,
          tags: (p.tags ?? []).join(', '),
          techStack: (p.techStack ?? []).join(', '),
          featured: p.featured,
          order: p.order,
          status: p.status,
        });
        this.linksArray.clear();
        for (const l of p.links ?? []) this.addLink(l.label, l.url);
        this.loading = false;
      },
      error: (err) => {
        this.ui.error(err?.error?.message ?? 'Load failed');
        this.loading = false;
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.ui.error('Please fix the errors and try again.');
      return;
    }
    const v = this.form.value;
    const payload: Partial<Project> = {
      title: v.title,
      slug: v.slug,
      summary: v.summary,
      description: v.description,
      coverImage: v.coverImage,
      tags: this.csv(v.tags),
      techStack: this.csv(v.techStack),
      links: (v.links as { label: string; url: string }[]).filter((l) => l.label && l.url),
      featured: !!v.featured,
      order: Number(v.order) || 0,
      status: v.status,
    };

    this.loading = true;
    const obs = this.id
      ? this.service.update(this.id, payload)
      : this.service.create(payload);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.ui.success(this.id ? 'Project updated' : 'Project created');
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.loading = false;
        this.ui.error(err?.error?.message ?? 'Save failed');
      },
    });
  }

  private csv(s: string): string[] {
    return (s ?? '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
  }
}
