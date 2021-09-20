import { FileItem } from "./file-item";
import { MaterialTipo } from "./material-tipo";
import { MaterialUnidad } from "./material-unidad";

export class Material {

  
	id:number;
	
	codigo:string;
	
	nombre:string;
	
	descripcion:string;
	
	cantidad:number;
	
	precio:number;
	
	se_vende:boolean;
	
	material_tipo: MaterialTipo;

	material_unidad: MaterialUnidad;

	fecha_creacion?: string;

	files: FileItem[];



}
