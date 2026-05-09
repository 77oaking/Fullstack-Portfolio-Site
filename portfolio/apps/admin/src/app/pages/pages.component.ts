import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../services/admin/admin.service';

interface NavItem {
  label: string;
  icon: string;
  link: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  readonly navSections: NavSection[] = [
    {
      label: 'General',
      items: [
        { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
        { label: 'Projects', icon: 'work', link: '/projects' },
        { label: 'Themes', icon: 'palette', link: '/themes' },
      ],
    },
    {
      label: 'CV Builder',
      items: [
        { label: 'Personal Data', icon: 'person', link: '/cv/personal' },
        { label: 'Summary', icon: 'notes', link: '/cv/summary' },
        { label: 'Experience', icon: 'work_history', link: '/cv/experience' },
        { label: 'Education', icon: 'school', link: '/cv/education' },
        { label: 'Skills', icon: 'psychology', link: '/cv/skills' },
        { label: 'Languages', icon: 'language', link: '/cv/languages' },
        { label: 'Certifications', icon: 'verified', link: '/cv/certifications' },
        { label: 'Awards', icon: 'emoji_events', link: '/cv/awards' },
        { label: 'References', icon: 'contacts', link: '/cv/references' },
        { label: 'Import Resume', icon: 'upload_file', link: '/cv/import' },
      ],
    },
  ];

  sidebarOpen = true;
  isMobile = false;

  constructor(private readonly admin: AdminService, private readonly router: Router) {}

  ngOnInit(): void {
    this.syncViewportState();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.syncViewportState();
  }

  get adminName(): string {
    return this.admin.getProfileName();
  }

  get sidenavMode(): 'over' | 'side' {
    return this.isMobile ? 'over' : 'side';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onNavigate(): void {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  logout(): void {
    this.admin.logout();
    this.router.navigate(['/login']);
  }

  private syncViewportState(): void {
    this.isMobile = window.matchMedia('(max-width: 1024px)').matches;
    this.sidebarOpen = !this.isMobile;
  }
}
