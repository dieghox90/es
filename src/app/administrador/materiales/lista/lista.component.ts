import { FileItem } from './../../../Models/file-item';
import { MaterialUnidad } from 'src/app/Models/material-unidad';
import { MaterialUnidadService } from './../../Services/material-unidad.service';
import { MaterialTipoService } from './../../Services/material-tipo.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Material } from 'src/app/Models/material';
import Swal from 'sweetalert2';
import { MaterialService } from '../../Services/material.service';
import { MaterialTipo } from 'src/app/Models/material-tipo';

import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

//Importando JQUERY
declare var $: any;

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {


  isEdit: number = 0;
  material: Material;
  tipos: MaterialTipo[] = [];
  materiales: Material[] = [];
  unidades: MaterialUnidad[] = [];
  materialesFiltrados: Material[] = [];

  urlBaseImg = environment.baseUrlImg;

  @ViewChild('inputFilter', { static: true }) inputElementSearch: ElementRef

  // ---------- File -------------
  public archivoSeleccionado: File | null;
  progreso: number = 0;
  tipoArchivo: string = "";
  imgPreview: string | ArrayBuffer;
  archivos: FileItem[] = [];
  archivo: FileItem;


  miFormulario: FormGroup = this.fb.group({
    codigo: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    cantidad: ['', [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
    material_tipo: ['', [Validators.required]],
    material_unidad: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private service: MaterialService,
    private serviceTipo: MaterialTipoService,
    private serviceUnidad: MaterialUnidadService,
    private datePipe: DatePipe
  ) {
    this.material = new Material();

  }

  ngOnInit(): void {
    this.service.listar().subscribe(mats => {
      this.materiales = mats;
    });

    this.serviceTipo.listar().subscribe(t => {
      this.tipos = t;
    });

    this.serviceUnidad.listar().subscribe(u => {
      this.unidades = u;
    });
  }


  campoNoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }

  guardarOactualizar() {

    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      this.toastr.error('Complete los campos correctamente', 'Validación')
      return;
    }
    const formValue = { ...this.miFormulario.value };

    // Asignamos los datos del formulario al objeto Material y los archivos cargados
    this.material = formValue;
    this.material.files = this.archivos;

    // ----- Para actualizr o guardar -----


    if (this.isEdit != 0) {
      //------- ACTUALIZAMOS ---------
      this.material.id = this.isEdit;
      console.log(this.material);
      this.service.actualizar(this.material).subscribe(u => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Actualizacion',
          html: "Material <strong>" + u.nombre + "</strong> Actualizado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );

        //Actualizar el valor editado en la lista que ya esta en pantalla
        /* let itemIndex = this.materiales.findIndex(item => item.id == u.id);
         this.materiales[itemIndex] = u;*/

        this.miFormulario.reset();
        this.material = u;
        $('#staticBackdrop').modal('hide');

      });

    } else {

      //--------- GUARDAMOS -------------
      const date = new Date();
      //this.material.fecha_creacion = this.datePipe.transform(date, "yyyy-MM-dd'T'HH:mm:ss")?.toString();

      this.service.agregar(this.material).subscribe(u => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro',
          html: "Material <strong>" + this.material.nombre + "</strong> Registrado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
        this.miFormulario.reset();
        this.miFormulario.controls["material_unidad"].patchValue('');
        this.miFormulario.controls["material_tipo"].patchValue('');
        // this.materiales.push(u);
        this.material = u;

        $('#staticBackdrop').modal('hide');
      });
    }

  }

  fijarActualizacionMaterial(mt: Material) {
    this.material = mt;
    this.miFormulario.patchValue(mt);
    this.isEdit = mt.id;
    this.archivos = mt.files;
    $('#staticBackdrop').modal('show');
    console.log(mt);

    // ---- Fijar las Unidades en el formulario -----
    this.miFormulario.controls["material_unidad"].patchValue(this.unidades.find(el => el.id === mt.material_unidad.id));

    // ---- Fijar los Tipos en el formulario -----
    this.miFormulario.controls["material_tipo"].patchValue(this.tipos.find(el => el.id === mt.material_tipo.id));
  }


  resetMaterial() {
    this.material = new Material();
    this.archivos = [];
    this.miFormulario.reset();
    this.miFormulario.controls["material_unidad"].patchValue('');
    this.miFormulario.controls["material_tipo"].patchValue('');
    this.isEdit = 0;
  }


  seleccionarArchivo(event) {

    if (event.target.files.length > 0) {

      console.log(event.target.files);


      /*const file = event.target.files[0];
      this.archivoSeleccionado = file;
      // preview de la img
      const reader = new FileReader();
      // leo el archivo seleccionado
      reader.onload = e => this.imgPreview = reader.result as string;
      reader.readAsDataURL(file);*/

      this.archivo = new FileItem(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = e => this.archivo.imgPreview = reader.result as string;
      reader.readAsDataURL(this.archivo.archivo);
      this.archivos.push(this.archivo);

    }

  }

  filtrarMateriales(event: any) {
    if (event.target.value != '') {
      this.service.filtrarMateriales(event.target.value).subscribe(m => {
        console.log(m);
        if (m.length > 0) {
          this.materialesFiltrados = m;
        } else {
          this.materialesFiltrados = [];
          const mate: Material = new Material();
          mate.nombre = "No se ecnontraron registros";
          this.materialesFiltrados.push(mate);
        }

      });
    } else {
      this.materialesFiltrados = [];
    }


  }

  fijarMaterialBusqueda(m: Material) {
    this.archivos = [];
    this.materialesFiltrados = [];
    this.material = m;
    //this.archivos = m.files;
    this.inputElementSearch.nativeElement.value = "";
  }

  openModalMaterial() {
    this.materialesFiltrados = [];
    this.archivos = [];
  }


  subirImagenes() {

    const mat: Material = new Material();
    mat.id = this.material.id;
    mat.files = [];

    this.archivos.forEach(f => {
      mat.files.push(f);
    });


    this.service.subirImagenes(mat).subscribe(u => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Carga Completa',
        html: "Imagenes <strong>" + u.nombre + "</strong> Subidas con éxito",
        showConfirmButton: true,
        timer: 1200
      }
      );

      this.material = u;
      this.archivos = [];

      $('#staticBackdropImagenes').modal('hide');

    });

  }

  quitarImagenModal(file: FileItem) {

    console.log(this.archivos.length);
    this.archivos = this.archivos.filter(f => f.nombreArchivo != file.nombreArchivo);
    console.log(this.archivos.length);
  }







  eliminarImagenDB(file: FileItem) {


    Swal.fire({
      title: "ELIMINACIÓN",
      html: `¿Desea eliminar la  imagen <strong>${file.nombreArchivo}</strong> <br>
      <img style="width: 150px;" src="${this.urlBaseImg + file.nombreArchivo}" class="img-fluid">`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI"
    }).then(result => {
      if (result.value) {



        this.material.files.forEach(f => {
          if (f.id == file.id) {
            f.elimina = true;
          }
        });


        this.service.eliminarImagenes(this.material).subscribe(u => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Eliminación',
            html: "Imagen Eliminada con éxito",
            showConfirmButton: true,
            timer: 1200
          }
          );

          this.material = u;
          this.archivos = [];


        });

      }
    });

  }



}





