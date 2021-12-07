import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Asistencia } from '../Models/asistencia';
import { AsistenciaConfiguracion } from '../Models/asistencia-configuracion';
import { Usuario } from '../Models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private baseUrl: string = environment.baseUrl + "/api";

  constructor(private http: HttpClient) { }


  agregar(asistencia: Asistencia): Observable<Asistencia> {
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

  getAsistenciaHoy(id: number): Observable<Asistencia> {
    return this.http.get<Asistencia>(`${this.baseUrl}/asistencias/hoy/${id}`);
  }

  getAsistenciaFiltrarUsuario(id: number, inicio: Date, fin: Date): Observable<Asistencia[]> {

    let params = new HttpParams()
      .set('id', id)
      .set('inicio', inicio.toDateString())
      .set('fin', fin.toDateString())
    return this.http.get<Asistencia[]>(`${this.baseUrl}/asistencias/filtrar/usuario/`, { params: params });

  }


  getAsistenciaFiltrarFechas(inicio: Date, fin: Date): Observable<Asistencia[]> {

    let params = new HttpParams()
      .set('inicio', inicio.toDateString())
      .set('fin', fin.toDateString())
    return this.http.get<Asistencia[]>(`${this.baseUrl}/asistencias/filtrar/fechas/`, { params: params });

  }


  public exportar(id: number, inicio: Date, fin: Date): Observable<any> {
    let params = new HttpParams()
      .set('id', id)
      .set('inicio', inicio.toDateString())
      .set('fin', fin.toDateString())
    
    return this.http.get<any>(this.baseUrl + "/asistencias/export", { params: params, responseType: 'blob' as 'json' });
  }

  public eliminar(id: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + "/asistencias/configuraciones/" + id);
  }

  // ------------------ ASISTENCIAS CONFIGURACIONES------------

  agregarConfiguracion(asistencia: AsistenciaConfiguracion): Observable<AsistenciaConfiguracion> {
    return this.http.post<AsistenciaConfiguracion>(`${this.baseUrl}/asistencias/configuraciones`, asistencia);
  }

  listarConfiguraciones(): Observable<AsistenciaConfiguracion[]> {
    return this.http.get<AsistenciaConfiguracion[]>(`${this.baseUrl}/asistencias/configuraciones/`);
  }

  actualizarConfiguracion(asistencia: AsistenciaConfiguracion): Observable<AsistenciaConfiguracion> {
    return this.http.put<AsistenciaConfiguracion>(`${this.baseUrl}/asistencias/configuraciones`, asistencia);
  }

  eliminarConfiguracion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/asistencias/configuraciones/${id}`)
  }

  filtrarEmpleados(termino: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuario-busqueda/${termino}`);
  }

}
