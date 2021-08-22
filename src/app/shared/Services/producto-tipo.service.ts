import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoTipo } from 'src/app/Models/producto-tipo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoTipoService {

  private baseUrl: string = environment.baseUrl+"/api";
  
  constructor(private http: HttpClient) { }

  agregar(mt: ProductoTipo):Observable<ProductoTipo> {
    return this.http.post<ProductoTipo>(`${this.baseUrl}/producto-tipo`, mt);
  }

  listar(): Observable<ProductoTipo[]> {
    return this.http.get<ProductoTipo[]>(`${this.baseUrl}/productos-tipos/`);
  }

  actualizar(mt: ProductoTipo): Observable<ProductoTipo> {
    return this.http.put<ProductoTipo>(`${this.baseUrl}/producto-tipo`, mt);
  }

  getProductoTipoPorId(id: number): Observable<ProductoTipo> {
    return this.http.get<ProductoTipo>(`${this.baseUrl}/producto-tipo/${id}`);
  }
}
