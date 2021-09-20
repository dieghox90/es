import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from 'src/app/Models/rol';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private baseUrl: string = environment.baseUrl+"/api";
  
  constructor(private http: HttpClient) { }

  
  agregar(rol: Rol):Observable<Rol> {
    return this.http.post<Rol>(`${this.baseUrl}/roles`, rol);
  }

  listar(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.baseUrl}/roles/`);
  }

  actualizar(rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.baseUrl}/roles`, rol);
  }

  getMaterialTipoPorId(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.baseUrl}/roles/${id}`);
  }
}
