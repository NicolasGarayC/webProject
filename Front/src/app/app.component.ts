import { Component } from '@angular/core';
import { NavbarVisibilityService } from './services/navbar-visibility.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  columnDefs = [
    { field: 'country', rowGroup: true, hide: true },
    { field: 'year', rowGroup: true, hide: true },
    { field: 'sport' },
    { field: 'total' }
];
  isNavbarVisible:any;

  constructor(private navbarVisibilityService: NavbarVisibilityService) {
   this.isNavbarVisible = this.navbarVisibilityService.visibility$;

  }
}
