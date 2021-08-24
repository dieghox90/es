import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/Models/producto';
import { Usuario } from 'src/app/Models/usuario';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl: string = environment.baseUrl + "/api";


  
  constructor(private http: HttpClient) { }

  
  agregar(mu: Producto): Observable<Producto> {
    
    let formData = new FormData();
    
    if (mu.files.length > 0) {
      mu.files.forEach(m => {
        formData.append("files", m.archivo);
        console.log("Service");
        console.log(m);
        
      });
    }
    
   // alert(mu.cliente.nombres + " "+ mu.cliente.id);
    mu.files = [];
    formData.append("producto", JSON.stringify(mu));
 
 
    return this.http.post<Producto>(`${this.baseUrl}/producto`, formData);

  
  }

  subirImagenes(ma: Producto) {
    
    let formData = new FormData();
    
    if (ma.files.length > 0) {
      ma.files.forEach(m => {
          formData.append("files", m.archivo);
      });
    }
    
    formData.append("id_producto", ma.id + "");

    return this.http.put<Producto>(`${this.baseUrl}/producto-saveimagenes`, formData);
    
  }


  eliminarImagenes(ma: Producto): Observable<Producto> {
  
    return this.http.put<Producto>(`${this.baseUrl}/producto-deleteimagenes`, ma);
    
  }
  

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos/`);
  }

  actualizar(mu: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/producto`, mu);
  }

  getProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/producto/${id}`);
  }



  filtrarProductos(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/producto-busqueda/${termino}`);
  }

  filtrarClientes( termino:string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuario-busqueda/${termino}`);
  }
}
