import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../services/admin/admin.service';

interface NavItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  readonly nav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    { label: 'Projects', icon: 'work', link: '/projects' },
    { label: 'Themes', icon: 'palette', link: '/themes' },
  ];

  sidebarOpen = true;

  constructor(private readonly admin: AdminService, private readonly router: Router) {}

  get adminName(): string {
    return this.admin.getProfileName();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.admin.logout();
    this.router.navigate(['/login']);
  }
}
