import { MaterialTipo } from './../../Models/material-tipo';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialTipoService {

  private baseUrl: string = environment.baseUrl+"/api";
  
  constructor(private http: HttpClient) { }

  
  agregar(mt: MaterialTipo):Observable<MaterialTipo> {
    return this.http.post<MaterialTipo>(`${this.baseUrl}/material-tipo`, mt);
  }

  listar(): Observable<MaterialTipo[]> {
    return this.http.get<MaterialTipo[]>(`${this.baseUrl}/materiales-tipos/`);
  }

  actualizar(mt: MaterialTipo): Observable<MaterialTipo> {
    return this.http.put<MaterialTipo>(`${this.baseUrl}/material-tipo`, mt);
  }

  getMaterialTipoPorId(id: number): Observable<MaterialTipo> {
    return this.http.get<MaterialTipo>(`${this.baseUrl}/material-tipo/${id}`);
  }
  
}
