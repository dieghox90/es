import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/login/Services/auth.service';
import { Asistencia } from 'src/app/Models/asistencia';
import { Usuario } from 'src/app/Models/usuario';
import { AsistenciaService } from 'src/app/Services/asistencia.service';
import Swal from 'sweetalert2';
import { AsistenciaConfiguracion } from '../../Models/asistencia-configuracion';

//Importando JQUERY
declare var $: any;

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.component.html',
  styleUrls: ['./asistencias.component.css']
})
export class AsistenciasComponent implements OnInit {

  usuarioBuscar: string = "";
  inicio: Date = new Date();
  fin: Date = new Date();
  errorJustificacion = false;

  texto: string = "No ha realizado una Búsqueda"

  asistencias: Asistencia[] = [];
  asistencia: Asistencia = new Asistencia();


  isEdit: number = 0;
  configuracion: AsistenciaConfiguracion;
  configuraciones: AsistenciaConfiguracion[] = [];

  empleadosFiltrados: Usuario[] = [];
  empleado: Usuario = new Usuario();

  observacion: string = "";

  index : string | any = sessionStorage.getItem('index') ;


  // ---- Asociado al input de busqueda-----
  @ViewChild('inputFilter') inputElementSearch;

  miFormulario: FormGroup = this.fb.group({
    jornada: ['', [Validators.required]],
    hora_ingreso: ['00:00', [Validators.required]],
    hora_salida: ['00:00', [Validators.required]],

  });


  constructor(private asistenciaService: AsistenciaService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public authService: AuthService) {
    this.configuracion = new AsistenciaConfiguracion();
  }

  ngOnInit(): void {

    this.asistenciaService.listarConfiguraciones().subscribe(res => {
      this.configuraciones = res;
    });
  }

  buscar() {

    if (this.inicio > this.fin) {
      this.toastr.error('La fecha de INICIO no puede ser mayor a la de FIN ', 'Error Fechas')
      return;
    }

    if (this.authService?.hasRole('ROLE_EMPLEADO')) { 
      this.empleado.id = this.index;
    }
    

    // Buscar por empleaod y fechas
    if (this.empleado?.id != null) {
      this.asistenciaService.getAsistenciaFiltrarUsuario(this.empleado.id, this.inicio, this.fin).subscribe(res => {

        if (res?.length > 0) {
          this.asistencias = res;
        } else {
          this.texto = "No se encontraron resultados con los datos proporcionados";
        }

      });
    } else {
      // Buscar solo por fechas
      this.asistenciaService.getAsistenciaFiltrarFechas(this.inicio, this.fin).subscribe(res => {
        if (res?.length > 0) {
          this.asistencias = res;
        } else {
          this.texto = "No se encontraron resultados con los datos proporcionados";
        }

      });
  

    }



  }


  guardarOactualizar() {

    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      this.toastr.error('Complete los campos correctamente', 'Validación')
      return;
    }
    const formValue = { ...this.miFormulario.value };

    // Asignamos los datos del formulario al objeto Material y los archivos cargados
    this.configuracion = formValue;

    // ---- ACTUALIZAMOS ----
    if (this.isEdit != 0) {

      this.configuracion.id = this.isEdit;
      this.asistenciaService.actualizarConfiguracion(this.configuracion).subscribe(res => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Actualización',
          html: "Jornada <strong>" + this.configuracion.jornada + "</strong> Actualizada con éxito",
          showConfirmButton: true,
          timer: 1200
        });
        this.miFormulario.reset();

        //Actualizar
        let itemIndex = this.configuraciones.findIndex(item => item.id == res.id);
        this.configuraciones[itemIndex] = res;
        this.configuracion = new AsistenciaConfiguracion();
        $('#staticBackdrop').modal('hide');
      });


    } else {

      this.asistenciaService.agregarConfiguracion(this.configuracion).subscribe(res => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro',
          html: "Jornada <strong>" + this.configuracion.jornada + "</strong> Registrada con éxito",
          showConfirmButton: true,
          timer: 1200
        });
        this.miFormulario.reset();
        this.configuraciones.push(res);

        $('#staticBackdrop').modal('hide');
      });
    }

  }

  fijarJornada(configuracion: AsistenciaConfiguracion) {
    this.isEdit = configuracion.id;
    this.miFormulario.patchValue(configuracion);
    $('#staticBackdrop').modal('show');
  }

  resetJornada() {

  }

  fijarAsistenciaJustificacion(asistencia: Asistencia) {
    this.asistencia = asistencia;
  }

  justificar() {
    if (this.configuracion?.id == null) {
      this.errorJustificacion = true;
      return;
    } else {
      this.errorJustificacion = false;

      //Hora de inicio
      let fechaIn = new Date(this.asistencia.fecha_registro);
      fechaIn.setHours(parseInt(this.configuracion.hora_ingreso.split(":")[0]), parseInt(this.configuracion.hora_ingreso.split(":")[1]));
      this.asistencia.fecha_ingreso = fechaIn;

      //Hora de salida
      let fechaFin = new Date(this.asistencia.fecha_registro);
      fechaFin.setHours(parseInt(this.configuracion.hora_salida.split(":")[0]), parseInt(this.configuracion.hora_salida.split(":")[1]));
      this.asistencia.fecha_salida = fechaFin;

      this.asistencia.descripcion = this.observacion;

      this.asistenciaService.actualizar(this.asistencia).subscribe(resp => {

        let itemIndex = this.asistencias.findIndex(item => item.id == resp.id);
        this.asistencias[itemIndex] = resp;

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Justificación',
          html: "Asistencia justificada con éxito",
          showConfirmButton: true,
          timer: 1200
        });

        $('#staticBackdrop2').modal('hide');
        this.configuracion = new AsistenciaConfiguracion();
        this.asistencia = new Asistencia();
        this.observacion = "";
      });



    }

  }




  filtrarEmpleados(event: any) {

    console.log(event.target.value);
    if (event.target.value != '') {
      this.asistenciaService.filtrarEmpleados(event.target.value).subscribe(m => {
        console.log(m);
        if (m.length > 0) {
          this.empleadosFiltrados = m;
        } else {
          this.empleadosFiltrados = [];
          const us: Usuario = new Usuario();
          us.nombres = "No se encontraron registros";
          this.empleadosFiltrados.push(us);
        }

      });
    } else {
      this.empleadosFiltrados = [];
      this.empleado = new Usuario();
    }

  }

  fijarEmpleadosBusqueda(u: Usuario) {
    // this.archivos = [];
    this.empleadosFiltrados = [];
    this.empleado = u;
    // this.producto.usuario = u;

    //this.archivos = m.files;
    this.inputElementSearch.nativeElement.value = u.apellidos + " " + u.nombres;
  }


  campoNoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }

  exportar() {
    let id = 0;
    if (this.empleado?.id != null) {
      id = this.empleado.id;
    }
    this.asistenciaService.exportar(id, this.inicio, this.fin).subscribe((data) => {
      let bloB = new Blob([data], { type: "application/vnd.ms-excel" });
      var downloadURL = window.URL.createObjectURL(bloB);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "asistencias.xls";
  

      link.click();
    });
  }


  eliminar(configuracion: AsistenciaConfiguracion) { 

    Swal.fire({
      title: "Eliminación",
      html: "¿Desea eliminar la jornada a <strong>" + configuracion.jornada + "</strong>?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI"
    }).then(result => {
      if (result.value) {

        this.asistenciaService.eliminar(configuracion.id).subscribe(resp => { 
          this.configuraciones=this.configuraciones.filter(c => configuracion.id != c.id);
          Swal.fire({
            title: "Eliminación: ",
            html: "Jornada eliminada con éxito",
            icon: "success"
          });
        });
      }
    });


   
  }


}
