import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../../services/users/userService';
import { Usuario } from '../../models/usuario.interface'; 
import { UserDialogComponent } from '../../dialogs/user-dialog/user-dialog.component';
import { ConfirmDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  standalone: true,
  imports: [MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatSnackBarModule,
    TranslateModule
  ],
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>();
  displayedColumns: string[] = ['correo', 'nombre', 'rol','estado', 'acciones'];
  isLoading: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService // Agregar TranslateService
  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios.data = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.snackBar.open(this.translate.instant('USERS.ERROR_LOAD'), this.translate.instant('USERS.SNACKBAR_CLOSE'), {
          duration: 3000,
        });
        console.error('Error fetching usuarios', error);
      }
    });
  }

  deleteUsuario(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => {
            this.loadUsuarios();
            this.snackBar.open(this.translate.instant('USERS.SUCCESS_UPDATE'), this.translate.instant('USERS.SNACKBAR_CLOSE'), {
              duration: 3000,
            });
          },
          error: (error: any) => {
            this.snackBar.open(this.translate.instant('USERS.ERROR_DELETE'), this.translate.instant('USERS.SNACKBAR_CLOSE'), {
              duration: 3000,
            });
            console.error('Error al eliminar el usuario', error);
          }
        });
      }
    });
  }

  editUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { usuario: { ...usuario }, isEdit: true }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService.updateUsuario(result).subscribe({
          next: () => {
            this.loadUsuarios();
            this.snackBar.open(this.translate.instant('USERS.SUCCESS_UPDATE'), this.translate.instant('USERS.SNACKBAR_CLOSE'), {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open(this.translate.instant('USERS.ERROR_UPDATE'), this.translate.instant('USERS.SNACKBAR_CLOSE'), {
              duration: 3000
            });
            console.error('Error al actualizar el usuario', error);
          }
        });
      }
    });
  }
  
  addUsuario(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: {
        usuario: {
          correo: '',
          passwd: '',
          cedula: 0,
          nombre: '',
          cambiarClave: false,
          rol: 'UNDEFINED'
        },
        isEdit: false
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsuarios();
      }
    });
  }
}
