import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { ThemeService } from './services/common/theme.service';

/**
 * APP_INITIALIZER — fetch the active theme once, before the app renders.
 * Avoids a flash of unthemed content.
 */
export function initTheme(theme: ThemeService) {
  return () => theme.bootstrap();
}

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initTheme,
      deps: [ThemeService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
