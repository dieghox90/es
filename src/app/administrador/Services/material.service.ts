import { MaterialIngreso } from './../../Models/material-ingreso';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { materialize } from 'rxjs/operators';
import { Material } from 'src/app/Models/material';
import { environment } from 'src/environments/environment';
import { Proveedor } from 'src/app/Models/proveedor';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private baseUrl: string = environment.baseUrl+"/api";
  
  constructor(private http: HttpClient) { }

  
  agregar(mu: Material): Observable<Material> {
    
    let formData = new FormData();
    
    if (mu.files?.length > 0) {
      mu.files.forEach(m => {
        formData.append("files", m.archivo);
      });
    } 
    

    mu.files = [];
    formData.append("material", JSON.stringify(mu));
 

   return this.http.post<Material>(`${this.baseUrl}/material`, formData);

  
  }

  subirImagenes(ma: Material) {
    
    let formData = new FormData();
    
    if (ma.files.length > 0) {
      ma.files.forEach(m => {
        formData.append("files", m.archivo);
        console.log(m.archivo);
      });
    }
    
    formData.append("id_material", ma.id+"");

    return this.http.put<Material>(`${this.baseUrl}/material-saveimagenes`, formData);
    
  }


  eliminarImagenes(ma: Material):Observable<Material> {
  
    return this.http.put<Material>(`${this.baseUrl}/material-deleteimagenes`, ma);
    
  }
  

  listar(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}/materiales/`);
  }

  actualizar(mu: Material): Observable<Material> {
    return this.http.put<Material>(`${this.baseUrl}/material`, mu);
  }

  getMaterialPorId(id: number): Observable<Material> {
    return this.http.get<Material>(`${this.baseUrl}/material/${id}`);
  }

  deleteFile(id:number, nombre:string) {
    let params = new HttpParams();
    params = params.append('nombre', nombre);
    params = params.append('_limit', 10)
  }


  filtrarMateriales( termino:string): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}/material-busqueda/${termino}`);
  }






  actualizarCantidad(mu: Material):Observable<Material> {
    return this.http.put<Material>(`${this.baseUrl}/material/cantidad`, mu);
  }
  

  // ------- MATERIAL INGRESO --------

 
 saveIngreso(mu: MaterialIngreso):Observable<MaterialIngreso> {
    return this.http.post<MaterialIngreso>(`${this.baseUrl}/material/ingreso`, mu);
  }

  listarIngresos(id:number): Observable<MaterialIngreso[]> {
    return this.http.get<MaterialIngreso[]>(`${this.baseUrl}/material/ingreso/all/${id}`);
  }

  actualizarIngreso(mu: MaterialIngreso): Observable<MaterialIngreso> {
    return this.http.put<MaterialIngreso>(`${this.baseUrl}/material/ingreso`, mu);
  }

  getMateriaIngresoId(id: number): Observable<MaterialIngreso> {
    return this.http.get<MaterialIngreso>(`${this.baseUrl}/material/ingreso/${id}`);
  }


  eliminarIngresoId(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/material/ingreso/${id}`);
  }
	
	

}
