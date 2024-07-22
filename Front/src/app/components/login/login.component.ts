import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginService } from '../../service/login.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      passwd: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value.correo, this.loginForm.value.passwd)
        .pipe(
          catchError(err => {
            this.snackBar.open('Error en la autenticación', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
            console.error('Error:', err);
            return of(`Error: ${err.message}`);
          })
        )
        .subscribe(response => {
          if (response && response.startsWith('Usuario Autenticado')) {
            this.snackBar.open('Usuario autenticado correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          } else {
            this.snackBar.open('Error de autenticación', 'X', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
          console.log('Respuesta del servidor:', response);
        });
    }
  }
}
