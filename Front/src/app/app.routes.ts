import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ReportsComponent } from './components/reports/reports.component';
import { VentasComponent } from './components/sales/sales.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { AuthGuard } from './services/login/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'articles', component: ArticlesComponent, canActivate: [AuthGuard] },
  { path: 'sales', component: VentasComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
