import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { ContactMessage } from '@portfolio/shared-types';
import { ContactMessagesService } from '../../services/portfolio-resources';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Inbox</h1>
          <p class="page-subtitle">{{ items().length }} message{{ items().length === 1 ? '' : 's' }}.</p>
        </div>
      </div>

      @if (items().length === 0) {
        <div class="card empty-state">No messages yet.</div>
      } @else {
        @for (m of items(); track m._id) {
          <div class="card" [class.unread]="!m.read" style="margin-bottom:.75rem">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem">
              <div style="min-width:0">
                <div style="display:flex; align-items:center; gap:.5rem">
                  <strong>{{ m.name }}</strong>
                  <span style="color:#94a3b8">&lt;{{ m.email }}&gt;</span>
                  @if (!m.read) { <span class="dot"></span> }
                </div>
                <div style="font-weight:600">{{ m.subject }}</div>
                <p style="margin:.5rem 0 0; color:#475569; white-space:pre-wrap">{{ m.message }}</p>
                <p style="margin:.5rem 0 0; color:#94a3b8; font-size:.8125rem">{{ m.createdAt | date:'medium' }}</p>
              </div>
              <div class="btn-row" style="flex-direction:column">
                @if (!m.read) {
                  <button mat-icon-button (click)="markRead(m)" matTooltip="Mark as read"><mat-icon>mark_email_read</mat-icon></button>
                }
                <button mat-icon-button color="warn" (click)="remove(m)"><mat-icon>delete</mat-icon></button>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .unread { border-color: var(--accent-1); }
    .dot { width: 8px; height: 8px; border-radius: 999px; background: var(--accent-1); display: inline-block; }
  `],
})
export class MessagesListPage implements OnInit {
  private readonly api = inject(ContactMessagesService);
  private readonly snack = inject(MatSnackBar);
  readonly items = signal<ContactMessage[]>([]);

  ngOnInit(): void { this.load(); }
  private load(): void { this.api.list().subscribe((r) => this.items.set(r.data ?? [])); }

  markRead(m: ContactMessage): void {
    if (!m._id) return;
    this.api.update(m._id, { read: true } as never).subscribe(() => this.load());
  }

  remove(m: ContactMessage): void {
    if (!m._id || !confirm('Delete this message?')) return;
    this.api.remove(m._id).subscribe(() => {
      this.snack.open('Deleted', 'Dismiss', { duration: 2500 });
      this.load();
    });
  }
}
