import { ProveedorService } from './../../Services/proveedor.service';
import { MaterialIngreso } from './../../../Models/material-ingreso';
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
import { AuthService } from 'src/app/login/Services/auth.service';
import { Proveedor } from 'src/app/Models/proveedor';

//Importando JQUERY
declare var $: any;

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {


  isEdit: number = 0;
  isEditIngreso: number = 0;
  material: Material;
  tipos: MaterialTipo[] = [];
  materiales: Material[] = [];
  unidades: MaterialUnidad[] = [];
  materialesFiltrados: Material[] = [];

  urlBaseImg = environment.baseUrlImg;


  // ---------- File -------------
  public archivoSeleccionado: File | null;
  progreso: number = 0;
  tipoArchivo: string = "";
  imgPreview: string | ArrayBuffer;
  archivos: FileItem[] = [];
  archivo: FileItem;


  // ------------ NUEVO INGRESO ---------
  materialIngreso: MaterialIngreso;
  materialesIngresos: MaterialIngreso[] = [];

  cantidadAnterior: number = 0;

  banderaNI = false;
  banderaNM = false;

  // ---- Filtro busqueda ----

  proveedoresFiltrados: Proveedor[] = [];
  proveedor: Proveedor = new Proveedor();

  // ---- Asociado al input de busqueda Proveedor Nuevo Material-----
  @ViewChild('inputFilterProveedorNuevoMaterial') inputElementSearchProveedorNM;


  // ---- Asociado al input de busqueda Proveedor Nuevo Ingreso-----
  @ViewChild('inputFilterProveedorNI') inputElementSearchProveedorNI;
  


  // ----  Para buscar materiales -----
  @ViewChild('inputFilter', { static: true }) inputElementSearch: ElementRef

  miFormulario: FormGroup = this.fb.group({
    codigo: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    descripcion: [''],
    fecha_creacion: [''],
    cantidad: ['', [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
    material_tipo: ['', [Validators.required]],
    material_unidad: ['', [Validators.required]],
  });


  miFormularioIngreso: FormGroup = this.fb.group({
    descripcion_ingreso: ['', [Validators.required]],
    cantidad_ingreso: ['', [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private service: MaterialService,
    private serviceTipo: MaterialTipoService,
    private serviceUnidad: MaterialUnidadService,
    private serviceProveedor:ProveedorService,
    private datePipe: DatePipe,

  ) {
    this.material = new Material();
    this.materialIngreso = new MaterialIngreso();
    this.materialIngreso.material = new Material();

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


  campoNoEsValidoIngreso(campo: string) {
    return this.miFormularioIngreso.controls[campo].errors && this.miFormularioIngreso.controls[campo].touched;
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

    if (this.archivos?.length > 0) {
      this.material.files = this.archivos;  
    }


    

    // ----- Para actualizar o guardar -----

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

      if (this.proveedor != null) {
        this.materialIngreso.proveedor = new Proveedor();
        this.materialIngreso.proveedor = this.proveedor;
      }
      

      console.log(this.material);
      this.service.agregar(this.material).subscribe(u => {


        this.materialIngreso.cantidad_ingreso = u.cantidad;
        this.materialIngreso.descripcion_ingreso = u.descripcion;
        this.materialIngreso.material.id = u.id;

        this.service.saveIngreso(this.materialIngreso).subscribe(mi => {

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registro',
            html: "Material <strong>" + this.material.nombre + "</strong> Registrado con éxito",
            showConfirmButton: true,
            timer: 1200
          });
          this.miFormulario.reset();
          this.miFormulario.controls["material_unidad"].patchValue('');
          this.miFormulario.controls["material_tipo"].patchValue('');
          // this.materiales.push(u);
          this.material = u;
          this.materialIngreso = new MaterialIngreso();
          this.materialIngreso.material = new Material();
          this.materialesIngresos.unshift(mi);

          $('#staticBackdrop').modal('hide');
          this.banderaNI = false;
          this.banderaNM = false;

        });
      });
    }

  }

  fijarActualizacionMaterial(mt: Material) {
    this.material = mt;
    this.miFormulario.patchValue(mt);
    this.isEdit = mt.id;
    this.archivos = mt.files;
    $('#staticBackdrop').modal('show');

    // ---- Fijar las Unidades en el formulario -----
    this.miFormulario.controls["material_unidad"].patchValue(this.unidades.find(el => el.id === mt.material_unidad.id));

    // ---- Fijar los Tipos en el formulario -----
    this.miFormulario.controls["material_tipo"].patchValue(this.tipos.find(el => el.id === mt.material_tipo.id));
  }


  fijarActualizacionMaterialIngreso() {
    this.materialIngreso = new MaterialIngreso();
    this.materialIngreso.material = new Material();
    $('#staticBackdropIngreso').modal('show');
    this.banderaNI = true;

  }

  resetMaterial() {
    //this.material = new Material();
    this.archivos = [];
    this.miFormulario.reset();
    this.miFormulario.controls["material_unidad"].patchValue('');
    this.miFormulario.controls["material_tipo"].patchValue('');
    this.isEdit = 0;
    this.banderaNI = false;
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
      this.materialesIngresos = [];
    }


  }

  fijarMaterialBusqueda(m: Material) {
    this.archivos = [];
    this.materialesFiltrados = [];
    this.material = new Material();
    this.material = m;
    //this.archivos = m.files;
    this.inputElementSearch.nativeElement.value = "";
    this.materialesIngresos = [];

    console.log(m.id);
    this.service.listarIngresos(m.id).subscribe(lista => {
      console.log(lista);
      this.materialesIngresos = lista;
    });
  }

  openModalMaterial() {
    this.materialesFiltrados = [];
    this.archivos = [];
    this.materialesIngresos = [];
    this.banderaNM = true;
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



  // --- GUARDAR O ACTUALIZAR NUEVO INGRESO---
  guardarMaterialIngreso() {

    const formValue = { ...this.miFormularioIngreso.value };

    // Asignamos los datos del formulario al objeto Material y los archivos cargados
    this.materialIngreso = formValue;
    this.materialIngreso.material = new Material();
    this.materialIngreso.material.id = this.material.id;

    
    if (this.proveedor != null) {
      this.materialIngreso.proveedor = new Proveedor();
      this.materialIngreso.proveedor = this.proveedor;
    }


    if (this.isEditIngreso > 0) {
      // ------ ACTUALIZAMOS-------
      if (this.cantidadAnterior > this.materialIngreso.cantidad_ingreso) {
        console.log("se suma");
        let numero = this.cantidadAnterior - this.materialIngreso.cantidad_ingreso;
        this.material.cantidad = this.material.cantidad - numero;
      } else if (this.cantidadAnterior < this.materialIngreso.cantidad_ingreso) {
        console.log("se restaa");
        let numero = this.materialIngreso.cantidad_ingreso - this.cantidadAnterior;
        this.material.cantidad = this.material.cantidad + numero;
      }


      this.materialIngreso.id = this.isEditIngreso;
      this.service.actualizarCantidad(this.material).subscribe(m => {
        this.service.saveIngreso(this.materialIngreso).subscribe(mi => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Ingreso Exitoso',
            html: "Nuevo Ingreso de material registrado con éxito",
            showConfirmButton: true,
            timer: 1200
          });

          this.materialIngreso = new MaterialIngreso();
          this.materialIngreso.material = new Material();
          $('#staticBackdropIngreso').modal('hide');
          this.miFormularioIngreso.reset();
          this.isEditIngreso = 0;

          let itemIndex = this.materialesIngresos.findIndex(item => item.id == mi.id);
          this.materialesIngresos[itemIndex] = mi;

        });

      });
      this.banderaNI = false;


    } else {

      // ------ GUARDAMOS-------

      this.material.cantidad = this.material.cantidad + this.materialIngreso.cantidad_ingreso; // sumamos en la backend
      this.service.actualizarCantidad(this.material).subscribe(m => {
        this.service.saveIngreso(this.materialIngreso).subscribe(mi => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Ingreso Exitoso',
            html: "Nuevo Ingreso de material registrado con éxito",
            showConfirmButton: true,
            timer: 1200
          });

          this.materialIngreso = new MaterialIngreso();
          this.materialIngreso.material = new Material();
          this.materialesIngresos.unshift(mi);
          $('#staticBackdropIngreso').modal('hide');
          this.miFormularioIngreso.reset();
          this.isEditIngreso = 0;
          this.banderaNI = false;

        });

      });
    }
  }

  fijarIngreso(ingreso: MaterialIngreso) {
    this.materialIngreso = ingreso;
    this.cantidadAnterior = ingreso.cantidad_ingreso;
    this.isEditIngreso = ingreso.id;
    this.miFormularioIngreso.patchValue(ingreso);
    this.banderaNI = true;
    if (ingreso?.proveedor != null) {
      this.proveedor = ingreso.proveedor;
      this.inputElementSearchProveedorNI.nativeElement.value = ingreso?.proveedor?.nombre_empresa + " - " + ingreso?.proveedor?.representante;
    }
    $('#staticBackdropIngreso').modal('show');


  }

  eliminar(ingreso: MaterialIngreso) {

    this.isEditIngreso = ingreso.id;

    Swal.fire({
      title: "ELIMINACIÓN",
      html: `¿Desea eliminar el ingreso con fecha ${ingreso.fecha_ingreso}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI"
    }).then(result => {
      if (result.value) {


        if (ingreso.cantidad_ingreso > this.material.cantidad) {

          this.service.eliminarIngresoId(ingreso.id).subscribe(res => {
            this.toastr.success('Ingreso de material eliminado con éxito', 'Eliminación');
            this.materialesIngresos = this.materialesIngresos.filter(mi => mi.id != ingreso.id);
          });


        } else {

          this.material.cantidad = this.material.cantidad - ingreso.cantidad_ingreso;

          this.service.actualizarCantidad(this.material).subscribe(m => {
            this.service.eliminarIngresoId(ingreso.id).subscribe(res => {
              this.toastr.success('Ingreso de material eliminado con éxito', 'Eliminación');
              this.materialesIngresos = this.materialesIngresos.filter(mi => mi.id != ingreso.id);
            });

          });
        }


      }

    });

  }



  filtrarProveedores(event: any) {

    if (event.target.value != '') {
      
      this.serviceProveedor.filtraProveedores(event.target.value).subscribe(m => {
        console.log(m);
        if (m.length > 0) {
          this.proveedoresFiltrados = m;
        } else {
          this.proveedoresFiltrados = [];
          const us: Proveedor = new Proveedor();
          us.nombre_empresa = "No se encontraron registros";
          this.proveedoresFiltrados.push(us);
        }

      });
    } else {
      this.proveedoresFiltrados = [];
      this.proveedor = new Proveedor();
    }


  }



  fijarPreveedorBusqueda(p: Proveedor) {
    // this.archivos = [];
    this.proveedoresFiltrados = [];
    this.proveedor = p;
    // this.producto.usuario = u;

    //this.archivos = m.files;
    if (this.banderaNI) {
      this.inputElementSearchProveedorNI.nativeElement.value = p.nombre_empresa + " - " + p.representante;
    } else {
      this.inputElementSearchProveedorNM.nativeElement.value = p.nombre_empresa + " - " + p.representante;
    }

    if (this.banderaNM) {
      this.inputElementSearchProveedorNM.nativeElement.value = p.nombre_empresa + " - " + p.representante;
    }
    
  }

  bloquearFiltro() {
    this.banderaNI = false;
    this.banderaNM = false;
  }


}





