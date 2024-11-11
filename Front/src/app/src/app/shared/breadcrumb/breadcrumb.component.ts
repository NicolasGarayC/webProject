import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from '../../../../models/breadcrumb.interface';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, TranslateModule],
  template: `
      <nav class="breadcrumb-container">
        <ul class="breadcrumb-list">
          <li>
            <a routerLink="/reports">{{ 'HOME' | translate }}</a>
            <mat-icon *ngIf="currentPath !== '/reports'" class="separator">chevron_right</mat-icon>
          </li>
          <li *ngIf="currentPath !== '/reports'">
            <a [class.active]="true">
              {{getCurrentPageLabel() | translate}}
            </a>
          </li>
        </ul>
      </nav>
    `,
  styles: [`
      .breadcrumb-container {
        padding: 8px 16px;
        background-color: #f5f5f5;
      }
      .breadcrumb-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
      }
      .breadcrumb-list li {
        display: flex;
        align-items: center;
      }
      .breadcrumb-list a {
        text-decoration: none;
        color: #666;
        font-size: 14px;
        cursor: pointer;
      }
      .breadcrumb-list a:hover {
        color: #333;
      }
      .breadcrumb-list a.active {
        color: #333;
        font-weight: 500;
      }
      .separator {
        font-size: 18px;
        color: #666;
        margin: 0 4px;
      }
    `]
})
export class BreadcrumbsComponent implements OnInit {
  currentPath: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.urlAfterRedirects;
      });
  }

  getCurrentPageLabel(): string {
    // Mapeo de rutas a etiquetas
    const routeLabels: { [key: string]: string } = {
      '/reports': 'MENU.REPORTS',
      '/articles': 'MENU.MANAGE_PRODUCTS',
      '/sales': 'MENU.MANAGE_SALES',
      '/usuarios': 'MENU.MANAGE_USERS',
      '/settings': 'MENU.SETTINGS'
    };

    return routeLabels[this.currentPath] || this.currentPath.substring(1).toUpperCase();
  }
}