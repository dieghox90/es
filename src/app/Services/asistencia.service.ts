import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Asistencia } from '../Models/asistencia';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private baseUrl: string = environment.baseUrl+"/api";
  
  constructor(private http: HttpClient) { }

  
  agregar(asistencia: Asistencia):Observable<Asistencia> {
    return this.http.post<Asistencia>(`${this.baseUrl}/asistencias`, asistencia);
  }

  listar(): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.baseUrl}/asistencias/`);
  }

  actualizar(asistencia: Asistencia): Observable<Asistencia> {
    return this.http.put<Asistencia>(`${this.baseUrl}/asistencias`, asistencia);
  }

  getAsistenciaPorId(id: number): Observable<Asistencia> {
    return this.http.get<Asistencia>(`${this.baseUrl}/asistencias/${id}`);
  }

  getAsistenciaHoy(): Observable<Asistencia> {
    return this.http.get<Asistencia>(`${this.baseUrl}/asistencias/hoy/`);
  }
  
}
