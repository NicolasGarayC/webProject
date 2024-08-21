
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,private router: Router) { }

  login(correo: string, passwd: string): Observable<any> {
    const url = `${this.apiUrl}/usuarios/authUsuario`;
    return this.http.post<any>(url, { correo, passwd }, { responseType: 'text' as 'json' });
  }
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
