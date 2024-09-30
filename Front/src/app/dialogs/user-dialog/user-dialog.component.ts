import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../models/usuario.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../services/users/userService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})
export class UserDialogComponent implements OnInit {
  usuarioForm: FormGroup;
  roles: string[] = ['ADMIN', 'OPERATIVO', 'AUDITOR'];
  isLoading: boolean = false;
  dialogTitle: string;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario; isEdit: boolean }
  ) {
    // Crear el formulario
    this.usuarioForm = this.fb.group({
      correo: [data.usuario.correo || '', [Validators.required, Validators.email]],
      passwd: [data.usuario.passwd || '', Validators.required],
      nombre: [data.usuario.nombre || '', Validators.required],
      cambiarClave: [false],
      cedula: [data.usuario.cedula || '', Validators.required],
      rol: [data.usuario.rol || '', Validators.required]
    });

    // Definir el título del diálogo basado en si es edición o no
    this.dialogTitle = data.isEdit ? 'USER_DIALOG.TITLE_EDIT' : 'USER_DIALOG.TITLE_ADD';
  }

  ngOnInit(): void {}

  onSave(): void {
    this.isLoading = true;
    this.usuarioService.addUsuario(this.usuarioForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.snackBar.open('Usuario añadido', 'Cerrar', { duration: 3000 });
        if (this.usuarioForm.valid) {
          this.dialogRef.close(true);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Ha ocurrido un error al registrar al usuario.', 'Cerrar', { duration: 3000 });
        console.error('Error al añadir el usuario', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
