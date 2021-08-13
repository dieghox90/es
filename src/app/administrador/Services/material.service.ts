import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Material } from 'src/app/Models/material';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private baseUrl: string = environment.baseUrl+"/api";
  
  constructor(private http: HttpClient) { }

  
  agregar(mu: Material):Observable<Material> {
    return this.http.post<Material>(`${this.baseUrl}/material`, mu);
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
}
