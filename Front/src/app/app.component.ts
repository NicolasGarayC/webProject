import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {LoginService} from '../../src/app/services/login/login.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isNavbarVisible: Observable<boolean>;

  constructor(private router: Router, private service: LoginService) {
    // Se basa en la ruta actual para determinar si se debe mostrar la barra de herramientas
    this.isNavbarVisible = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects !== '/login')
    );
  }

  ngOnInit() {}

  logout(){
    console.log("saliendo");
    
    this.service.logout()
  }
}
