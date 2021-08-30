import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/Models/usuario';
import { LocalService } from 'src/app/Services/local.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseEndPoint = environment.AUTH_ENDPOINT;


  public _usuario: Usuario ; //_ porque va a tener un metodo accesso un metodo geter
  public _token: string | null ;

  constructor(private localService: LocalService, private http: HttpClient) { }

  login(usuario: Usuario): Observable<any> {

  
    const credenciales = btoa('angularapp' + ':' + 'elegant12345');//encriptar
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    return this.http.post<any>(this.baseEndPoint, params.toString(), { headers: httpHeaders });
  }


  guardarUsuario(accessToken: string): void {

    let payload = this.obtenerToken(accessToken);
    console.log(payload.authorities);
    this._usuario = new Usuario();
    this._usuario.nombres = payload.nombres;
    this._usuario.apellidos = payload.apellidos;
    this._usuario.id = payload.index; //di
    this._usuario.username = payload.username; //ver si se pone use_name
    this._usuario.rolesAuth = payload.authorities;
    this.localService.setJsonValue('usuario', this._usuario);

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    sessionStorage.setItem('nombres', payload.nombres);
    sessionStorage.setItem('apellidos', payload.apellidos);
    sessionStorage.setItem('index',payload.index);

  }
  guardarToken(accessToken: string): void {
    this._token = accessToken;

    sessionStorage.setItem('token', accessToken);

    this.localService.setJsonValue('token', accessToken);
    
  }


  obtenerToken(accessToken: string | null): any {
    if (accessToken != null) {
      return JSON.parse(atob(decodeURIComponent(accessToken.split(".")[1])));
    }

    return null;
  }


  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(this.localService.getJsonValue('usuario_itspm')) as Usuario;
      this._usuario = this.localService.getJsonValue('usuario') as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string | null {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token')) {
      this._token = this.localService.getJsonValue('token');

      this._token = sessionStorage.getItem('token');//borrar
      
      return this._token;
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.obtenerToken(this.token);

    if (payload != null && payload.username && payload.username.length > 0) {
      //if (payload != null && payload.completo && payload.completo.length > 0) ;
      return true;
    }

    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = new Usuario();
    sessionStorage.clear();
    this.localService.clearToken();
  }

  hasRole(role: String): boolean {
    if (this.usuario?.rolesAuth?.includes(role)) {
      return true;
    }

    return false;
  }


}
