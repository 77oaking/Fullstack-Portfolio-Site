import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from '../../services/common/settings.service';
import type { Settings } from '@portfolio/shared-types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  settings$!: Observable<Settings>;

  constructor(private readonly settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settings$ = this.settingsService.get();
  }
}
