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

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  standalone: true,
  imports: [MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatSnackBarModule
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
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data:any) => {
        this.usuarios.data = data;
        this.isLoading = false;
      },
      error: (error:any) => {
        this.isLoading = false;
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
          next: () => this.loadUsuarios(),
          error: (error:any) => console.error('Error al eliminar el usuario', error)
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
            this.snackBar.open('Usuario actualizado', 'Cerrar', {
              duration: 3000
            });
          },
          error: (error) => {
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
