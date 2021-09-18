import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from 'src/app/Services/asistencia.service';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.component.html',
  styleUrls: ['./asistencias.component.css']
})
export class AsistenciasComponent implements OnInit {

  constructor( private asistenciaService:AsistenciaService) { }

  ngOnInit(): void {
  }

}
