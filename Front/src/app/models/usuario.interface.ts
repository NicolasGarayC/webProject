export interface Usuario {
    id: number;
    correo: string;
    passwd: string;
    cedula: number;
    nombre: string;
    estado: string;
    cambiarClave: boolean;
    fechaUltimoCambioClave: Date;
    token: number | null;
    intentosFallidos: number;
    rol: Role;
  }
  
  export interface Role {
    id: number;
    rol: string;
  }
  