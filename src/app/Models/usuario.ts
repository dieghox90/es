import { Direccion } from "./direccion";

export class Usuario {

  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  celular: string;
  correo: string;
  direccion: Direccion;
  activado: boolean;
}
