import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LoginService } from './services/login/login.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // Importa TranslateModule
import { BreadcrumbsComponent } from './src/app/shared/breadcrumb/breadcrumb.component'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    RouterModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    TranslateModule, // Asegúrate de que TranslateModule esté incluido aquí
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isNavbarVisible: Observable<boolean>;

  constructor(
    private router: Router,
    private service: LoginService,
    private translate: TranslateService
  ) {
    this.isNavbarVisible = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects !== '/login')
    );
    // Set default language
    const browserLang = this.translate.getBrowserLang() ?? 'en';
    this.translate.setDefaultLang(browserLang.match(/en|es/) ? browserLang : 'en');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('selectedLanguage', language); // Guardar el idioma seleccionado en el localStorage
  }

  ngOnInit() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      this.translate.use(savedLanguage);
    }
  }

  logout() {
    this.service.logout();
  }
}
