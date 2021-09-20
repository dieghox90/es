import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  public _nombres:any;
  public _apellidos: any;

  constructor() { }


  obtenerDatos() {
    this._nombres = sessionStorage.getItem("nombres");
    this._apellidos = sessionStorage.getItem("apellidos");
  }

  fijarDatos(nombres:string, apellidos:string) {
    this._nombres = sessionStorage.setItem("nombres",nombres);
    this._apellidos = sessionStorage.setItem("apellidos",apellidos);
  }
}
