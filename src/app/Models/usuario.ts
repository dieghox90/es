import { Direccion } from "./direccion";
import { Rol } from "./rol";

export class Usuario {

  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  celular: string;
  correo: string;
  direccion: Direccion;
  activado: boolean;
  username: string;
  password: string;
  codigoRecuperacion: string;
  roles:Rol[]=[];

// -- Para los Authorities del login
  rolesAuth: String[] = [];
}
