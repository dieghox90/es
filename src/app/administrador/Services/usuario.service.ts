import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/Models/usuario';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private baseUrl: string = environment.baseUrl+"/api";
  
  constructor(private http: HttpClient) { }

  
  agregarUsuario(usuario: Usuario):Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios`, usuario);
  }

  listarUsuariosActivos(estado:boolean): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios/all/${estado}`);
  }

  actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/usuarios`, usuario);
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/${id}`);
  }

  inactivar(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/usuarios/inactivar/${id}`,null);
  }

  activar(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/usuarios/activar/${id}`,null);
  }


}
