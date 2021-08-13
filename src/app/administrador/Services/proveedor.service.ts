import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from 'src/app/Models/proveedor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  
  private baseUrl: string = environment.baseUrl + "/api";
  
  constructor(private http: HttpClient) { }

  
  agregarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${this.baseUrl}/proveedor`, proveedor);
  }

  listarProveedoresActivos(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.baseUrl}/proveedores`);
  }

  actualizarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.baseUrl}/proveedor`, proveedor);
  }

  getProveedorPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.baseUrl}/proveedor/${id}`);
  }

}