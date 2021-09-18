import { Usuario } from "./usuario";

export class Asistencia {

  id: number;

  descripcion: string;


  fecha_ingreso: Date;
  fecha_salida: Date;

  fecha_registro: Date;
  
  estado: boolean;

  usuario: Usuario;

}
