import { ProductoTipo } from './producto-tipo';
import { Direccion } from "./direccion";
import { Usuario } from './usuario';
import { FileItem } from './file-item';

export class Producto {

   id:number;
	
	nombre:string;
	
	descripcion:string;
	
	cantidad:number;
	
	precio:number;
	
	se_vende:boolean;
	
	
	fecha_creacion:Date;
	

  direccion_entrega:Direccion;
	
	producto_tipo:ProductoTipo;
	
  usuario:Usuario;
	
  files: FileItem[];

}
