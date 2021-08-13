import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MaterialUnidad } from 'src/app/Models/material-unidad';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialUnidadService {

  private baseUrl: string = environment.baseUrl+"/api";
  
  constructor(private http: HttpClient) { }

  
  agregar(mu: MaterialUnidad):Observable<MaterialUnidad> {
    return this.http.post<MaterialUnidad>(`${this.baseUrl}/material-unidad`, mu);
  }

  listar(): Observable<MaterialUnidad[]> {
    return this.http.get<MaterialUnidad[]>(`${this.baseUrl}/materiales-unidades/`);
  }

  actualizar(mu: MaterialUnidad): Observable<MaterialUnidad> {
    return this.http.put<MaterialUnidad>(`${this.baseUrl}/material-unidad`, mu);
  }

  getMaterialUnidadPorId(id: number): Observable<MaterialUnidad> {
    return this.http.get<MaterialUnidad>(`${this.baseUrl}/material-unidad/${id}`);
  }
}
