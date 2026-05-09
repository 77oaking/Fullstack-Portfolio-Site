import { Component, Input, OnInit, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

/**
 * A simple chip-list editor for `string[]` fields. Drop in anywhere the user
 * needs to enter a list of free-text values (achievements, tech stack, tags, ...).
 *
 *   <app-string-list label="Tech stack" [formControlName]="'techStack'"></app-string-list>
 */
@Component({
  selector: 'app-string-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule],
  template: `
    <div class="field">
      <label>{{ label }}</label>
      <mat-chip-grid #grid>
        @for (item of value(); track $index) {
          <mat-chip-row (removed)="remove($index)">
            {{ item }}
            <button matChipRemove [attr.aria-label]="'Remove ' + item">
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip-row>
        }
        <input
          [placeholder]="placeholder"
          [matChipInputFor]="grid"
          [matChipInputAddOnBlur]="true"
          (matChipInputTokenEnd)="add($event.value, $event.chipInput)"
        />
      </mat-chip-grid>
    </div>
  `,
  styles: [
    `:host { display: block; }
     mat-chip-grid { background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 6px; }
     label { font-size: .8125rem; font-weight: 600; color: var(--text-2); display: block; margin-bottom: 4px; }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StringListInputComponent),
      multi: true,
    },
  ],
})
export class StringListInputComponent implements ControlValueAccessor, OnInit {
  @Input() label = 'Items';
  @Input() placeholder = 'Type and press Enter';

  readonly value = signal<string[]>([]);
  private onChange: (v: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    /* no-op */
  }

  writeValue(v: string[] | null): void {
    this.value.set(Array.isArray(v) ? [...v] : []);
  }
  registerOnChange(fn: (v: string[]) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  add(raw: string, input: { clear: () => void }): void {
    const v = (raw ?? '').trim();
    if (!v) return;
    this.value.update((arr) => [...arr, v]);
    this.onChange(this.value());
    this.onTouched();
    input.clear();
  }

  remove(idx: number): void {
    this.value.update((arr) => arr.filter((_, i) => i !== idx));
    this.onChange(this.value());
  }
}
