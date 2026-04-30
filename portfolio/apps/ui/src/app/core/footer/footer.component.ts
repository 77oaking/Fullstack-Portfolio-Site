import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from '../../services/common/settings.service';
import type { Settings } from '@portfolio/shared-types';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly settings$: Observable<Settings>;

  constructor(settings: SettingsService) {
    this.settings$ = settings.get();
  }
}
