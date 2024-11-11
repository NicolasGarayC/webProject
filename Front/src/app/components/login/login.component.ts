import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../../shared/firebase.config';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSnackBarModule,
    CommonModule,
    MatSidenavModule,
    TranslateModule

  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      passwd: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value.correo, this.loginForm.value.passwd)
        .pipe(
          catchError(err => {
            this.snackBar.open(this.translate.instant('LOGIN.AUTH_ERROR'), this.translate.instant('LOGIN.SNACKBAR_CLOSE'), {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
            console.error('Error:', err);
            return of(`Error: ${err.message}`);
          })
        )
        .subscribe(response => {
          response = JSON.parse(response);
          if (response && response.message === 'Usuario Autenticado') {
            const token = response.token;
            localStorage.setItem('authToken', token);
            this.router.navigate(['/reports']);
            this.snackBar.open(this.translate.instant('LOGIN.AUTH_SUCCESS'), this.translate.instant('LOGIN.SNACKBAR_CLOSE'), {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          } else {
            this.snackBar.open(this.translate.instant('LOGIN.AUTH_ERROR'), 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
    }
  }

  // Método para autenticarse con Google
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        result.user.getIdToken().then((token) => {
          localStorage.setItem('authToken', token);
          this.router.navigate(['/reports']);
          this.snackBar.open(this.translate.instant('LOGIN.AUTH_SUCCESS'), this.translate.instant('LOGIN.SNACKBAR_CLOSE'), {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
        });
      })
      .catch((error) => {
        this.snackBar.open(this.translate.instant('LOGIN.AUTH_ERROR'), 'X', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      });
  }
}