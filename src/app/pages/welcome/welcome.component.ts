import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Asistencia } from 'src/app/Models/asistencia';
import { AsistenciaService } from 'src/app/Services/asistencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {


  nombres: string | null;
  apellidos: string | null;
  asistencia: Asistencia;

  public datePipe: DatePipe;

  constructor(private asistenciaService: AsistenciaService) {
    this.asistencia = new Asistencia();
  }

  ngOnInit() {


    this.asistenciaService.getAsistenciaHoy().subscribe(r => {
      if (r != null) {
        this.asistencia = r;
      } else {
        this.asistencia.fecha_registro = new Date();
      }
    });


    this.nombres = sessionStorage.getItem('nombres');
    this.apellidos = sessionStorage.getItem('apellidos');

  }




  abrirEntrada() {
    Swal.fire({
      title: "Registro de Entrada",
      html: "¿Desea registrar su hora de entrada?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI",
      cancelButtonText: "NO"
    }).then(result => {
      if (result.value) {

        this.asistencia.fecha_ingreso = new Date();

        this.asistenciaService.agregar(this.asistencia).subscribe(resp => {
          this.asistencia = resp;
          Swal.fire({
            title: "Registro: ",
            html: "Su hora de entrada se ha registrado con éxito",
            icon: "success"
          });
        });
      }
    });
  }


  abrirSalida() {
    Swal.fire({
      title: "Registro de Salida",
      html: "¿Desea registrar su hora de salida?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI",
      cancelButtonText: "NO"
    }).then(result => {
      if (result.value) {

        this.asistencia.fecha_salida = new Date();

        this.asistenciaService.actualizar(this.asistencia).subscribe(resp => {
          this.asistencia = resp;
          Swal.fire({
            title: "Registro: ",
            html: "Su hora de salida se ha registrado con éxito",
            icon: "success"
          });
        });
      }
    });
  }

}
