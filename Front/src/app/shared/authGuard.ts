import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from 'firebase/auth'; // Importa Auth desde Firebase
import { auth } from './firebase.config'; // Importa la configuración de Firebase

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      // Verifica si el usuario está autenticado con Firebase
      onAuthStateChanged(auth, (user:any) => {
        if (user) {
          resolve(true); // Permitir acceso
        } else {
          this.router.navigate(['/login']); // Redirigir al login si no está autenticado
          resolve(false); // Bloquear acceso
        }
      });
    });
  }
}
