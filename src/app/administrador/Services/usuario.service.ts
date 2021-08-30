import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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


  
  getUsuarioPorCedulaOcorreo(cedula: string, correo: string): Observable<Usuario[]>{
    let params = new HttpParams()
    .set('cedula', cedula)
    .set('correo', correo)
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuario/find/cedula-correo/`, {params:params});
  }



  inactivar(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/usuarios/inactivar/${id}`,null);
  }

  activar(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/usuarios/activar/${id}`,null);
  }

  
  enviarCorreoRecuperacion(correo: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/clave/correos/${correo}`);
  }


  compararCodigoRecuperacion(codigo: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/clave/codigo/${codigo}`);
  }


  cambiarClave(usuario: Usuario):Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/clave/restablecer`, usuario);
  }

 

  getUsuarioLogin(busqueda: string): Observable<Usuario>{
    return this.http.get<Usuario>(`${this.baseUrl}/clave/usuarios/find/${busqueda}`);
  }

  getClaveEncriptada(claveDB: string,claveComparar: string): Observable<any>{
    let params = new HttpParams()
    .set('claveDB', claveDB)
    .set('claveComparar', claveComparar)
    return this.http.get<any>(`${this.baseUrl}/usuario/clave/actual/`, {params:params, responseType: 'text' as 'json'});
  }



}
