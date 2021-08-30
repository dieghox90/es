import { Material } from "./material";
import { Proveedor } from "./proveedor";

export class MaterialIngreso {

  id: number;
  
	descripcion_ingreso:string;
	
  cantidad_ingreso:number;
	
  fecha_ingreso?: string;;
	
  material: Material;
  
  proveedor: Proveedor;
	
}
