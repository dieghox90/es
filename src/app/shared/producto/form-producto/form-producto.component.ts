
import { HttpClient } from '@angular/common/http';
import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Direccion } from 'src/app/Models/direccion';

import { FileItem } from 'src/app/Models/file-item';
import { Producto } from 'src/app/Models/producto';
import { ProductoTipo } from 'src/app/Models/producto-tipo';
import Swal from 'sweetalert2';
import { ProductoTipoService } from '../../Services/producto-tipo.service';
import { ProductoService } from '../../Services/producto.service';
import * as Mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { FeatureCollection } from 'geojson';
import * as Feature from 'geojson';
import { environment } from 'src/environments/environment';
import { Usuario } from 'src/app/Models/usuario';
import { switchMap } from 'rxjs/operators';



//Importando JQUERY
declare var $: any;

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html',
  styleUrls: ['./form-producto.component.css']
})
export class FormProductoComponent implements OnInit, AfterViewInit  {


  isEdit: number = 0;
  producto: Producto;
  productos: Producto[];


  geocoder: any;

  provincia: any;
  canton: string = "";
  coordenadasProvincia: [number, number];

  archivos: FileItem[] = [];
  archivo: FileItem;

  tipos: ProductoTipo[] = [];

  usuariosFiltrados: Usuario[] = [];
  usuario: Usuario = new Usuario();

  urlBaseImg = environment.baseUrlImg;

  activarEntrega = false;

  activarCliente = false;




  // ---- Asociado al input de busqueda-----
  @ViewChild('inputFilter') inputElementSearch;

  //@ViewChild('inputFilter', {static: true}) inputElementSearch: ElementRef;


  // ------

  @ViewChild('entrega', { static: true }) checkInput: ElementRef;



  @ViewChild('clienteInput', { static: true }) checkInputCliente: ElementRef;

  // --- Mapa -----
  @ViewChild('mapa') divMapa!: ElementRef
  mapa: mapboxgl.Map;
  marker: any;
  zoomLevel: number = 15;
  center: [number, number] = [-78.7638587,  -3.828434];

  
  miFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    us: [''],
    descripcion: [''],
    cantidad: ['', [Validators.required,Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
    precio: ['', [Validators.required,Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
    producto_tipo: ['', [Validators.required]],
    direccion_entrega: this.fb.group({
      provincia: [''],
      ciudad: ['',],
      direccion: [''],
    })
  });


  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: ProductoService,
    private serviceTipo: ProductoTipoService,
    private http: HttpClient) {
    this.producto = new Producto();
    this.producto.usuario = new Usuario();
    this.producto.direccion_entrega = new Direccion();
    this.producto.producto_tipo = new ProductoTipo();
  }
 

  ngOnInit(): void {  

    this.serviceTipo.listar().subscribe(t => {
      this.tipos = t;
    });

    if (!this.router.url.includes('editar')) {
      return;
    }



    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.service.getProductoPorId(id))
      )
      .subscribe(p => {
        this.isEdit = p.id;
        this.miFormulario.patchValue(p);

        this.miFormulario.controls["producto_tipo"].patchValue(this.tipos.find(pr => pr.id ===p.producto_tipo.id));

        this.producto = p;

       // this.usuario = p.usuario;
   
       console.log("NGONINIT");
       console.log(this.producto)
          this.archivos = p.files;
        
        if (p.direccion_entrega?.provincia != "") {

          this.marker.setLngLat([p.direccion_entrega.longitud, p.direccion_entrega.latitud]);
          this.mapa.setCenter([p.direccion_entrega.longitud, p.direccion_entrega.latitud]);
          this.activarEntrega = true;
          this.miFormulario.controls["producto_tipo"].patchValue(this.tipos.find(el => el.id === p.producto_tipo.id));
          this.checkInput.nativeElement.checked = true;
        } 

        if (this.producto.usuario?.id != null) {

          console.log(this.producto);
            this.activarCliente = true;
            this.checkInputCliente.nativeElement.checked = true;
           //this.inputElementSearch.nativeElement.value = this.producto.usuario?.apellidos + " " + this.producto.usuario?.nombres;
         // this.usuario = this.producto.usuario;
            this.miFormulario.controls["us"].patchValue(this.producto.usuario?.apellidos + " " + this.producto.usuario?.nombres);
          
          
        } else {
          this.activarCliente = false;
          this.checkInputCliente.nativeElement.checked = false ;
        }

  
      });
    
    
    
  

         
  }





  ngAfterViewInit(): void {

    // ---- PARA EL MAPA ------
    (Mapboxgl as any).accessToken = environment.mapBoxToken;
    this.mapa = new Mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });


    // ---- Colocar Marcador ------

    this.marker = new Mapboxgl.Marker({
      draggable: true
    })
      .setLngLat(this.mapa.getCenter())
      .addTo(this.mapa);


    // ---- Evento de zoom con la rueda del mouse ---
    this.mapa.on('zoom', () => {
      this.zoomLevel = this.mapa.getZoom();
    });

    //Evento cuando termina de hacerse el zoom
    this.mapa.on('zoomend', () => {
      if (this.mapa.getZoom() > 18) {
        this.mapa.zoomTo(18);
      }
    });

    //Evento cuando se mueve el mapa con el mouse
    this.mapa.on('move', (event) => {
      const { lng, lat } = event.target.getCenter();
      this.center = [lng, lat];
    });


    
  }





  guardarOactualizar() {

    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      this.toastr.error('Complete los campos correctamente', 'Validación')
      return;
    }
    const formValue = { ...this.miFormulario.value };

    // Asignamos los datos del formulario al objeto Material y los archivos cargados
    this.producto = formValue;





    if (this.activarEntrega) {
      this.producto.direccion_entrega.longitud = this.marker.getLngLat().lng;
      this.producto.direccion_entrega.latitud = this.marker.getLngLat().lat;
    }


    //this.producto.usuario = this.usuario;

    if (this.activarCliente == true) {
      if (this.usuario.id == null) {
        this.toastr.warning('Ha marcado la opción Pedido por cliente, per no ha seleccionado ningún Cliente', 'Aviso')
        return;
      } else {
        this.producto.usuario = new Usuario();
        this.producto.usuario.id = this.usuario.id;

      }
    } else {
      this.producto.se_vende = true; //productos que no pertenecen a un cliente mediante pedido
    }


    // ----- Para actualizAr o guardar -----    

    if (this.isEdit != 0) {
      //------- ACTUALIZAMOS ---------
      this.producto.id = this.isEdit;
      //this.archivos = this.producto.files;
      let fotosAux = this.producto.files;
      this.producto.files = [];
      this.service.actualizar(this.producto).subscribe(u => {


        if (this.archivos?.length > 0) {

          this.archivos.forEach(ar => {
            this.producto.files.push(ar);
          });

          fotosAux?.forEach(ar => {
            this.producto.files.push(ar);
          });

          
          console.log(this.producto);

         this.service.subirImagenes(this.producto).subscribe(p => {
            this.producto = p;
          });
        
        }


        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Actualización',
          html: "Producto <strong>" + u.nombre + "</strong> Actualizado con éxito",
          showConfirmButton: true,
          timer: 1200
        });

        this.router.navigate(['/shared/listar-productos']);

      });

    } else {

      //--------- GUARDAMOS -------------
      const date = new Date();
      //this.material.fecha_creacion = this.datePipe.transform(date, "yyyy-MM-dd'T'HH:mm:ss")?.toString();  
      this.producto.files = [];
      this.service.guardarSinImagen(this.producto).subscribe(u => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro',
          html: "Producto <strong>" + this.producto.nombre + "</strong> Registrado con éxito",
          showConfirmButton: true,
          timer: 1200
        });

        if (this.archivos?.length > 0) {
          this.producto = u;
          
          this.producto.files = this.archivos;
          this.service.subirImagenes(this.producto).subscribe(p => {
            this.producto = p;
          });
        
        }

        this.miFormulario.reset();
        this.miFormulario.controls["producto_tipo"].patchValue('');
        this.producto = new Producto;
        this.producto.usuario = new Usuario();
        this.producto.direccion_entrega = new Direccion();
        this.producto.producto_tipo = new ProductoTipo();
        this.archivos = [];
        this.inputElementSearch.nativeElement.value = "";
        this.producto = u;
        this.router.navigate(['/shared/listar-productos']);
        this.activarEntrega = false;
        this.activarCliente = false;
      });
    }


  }



  buscarProvincia(value: string) {

    this.provincia = value;
    this.http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?country=EC&access_token=pk.eyJ1IjoiZGllZ2hveDkwIiwiYSI6ImNrampmcXR1dTAxa3cyc3F3d2ZjcGRodnIifQ.w3Y0NR-ro5Ak5EgqKVgJRQ`)
      .subscribe((res: any) => {
        console.log(res.features);
        this.mapa.setCenter(res.features[0].geometry.coordinates);
        this.mapa.setZoom(8);
        this.marker.setLngLat(res.features[0].geometry.coordinates);
        this.mapa.setCenter(res.features[0].geometry.coordinates);
        this.coordenadasProvincia = res.features[0].center;

      });

  }


  buscarCanton(value: string) {

    this.http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json?access_token=pk.eyJ1IjoiZGllZ2hveDkwIiwiYSI6ImNrampmcXR1dTAxa3cyc3F3d2ZjcGRodnIifQ.w3Y0NR-ro5Ak5EgqKVgJRQ`)
      .subscribe((res: any) => {
        console.log(res.features);

        if (res.features[0].place_name.includes('Ecuador')) {
          this.mapa.setCenter(res.features[0].geometry.coordinates);
          this.mapa.setZoom(13);
          this.marker.setLngLat(res.features[0].geometry.coordinates);
          this.mapa.setCenter(res.features[0].geometry.coordinates);
        } else {

          this.mapa.setCenter(this.coordenadasProvincia);
          this.mapa.setZoom(8);
        }



      });

  }

  campoNoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }

  campoNoValidoDireccion(campo: string) {
    return this.miFormulario.get(campo)?.errors && this.miFormulario.get(campo)?.touched
  }



  zoomOut() {
    this.mapa.zoomOut();
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomCambio(valor: string) {
    this.mapa.zoomTo(Number(valor));
  }


  filtrarClientes(event: any) {
    
    if (event.target.value != '') {
      this.service.filtrarClientes(event.target.value).subscribe(m => {
        console.log(m);
        if (m.length > 0) {
          this.usuariosFiltrados = m;
        } else {
          this.usuariosFiltrados = [];
          const us: Usuario = new Usuario();
          us.nombres = "No se encontraron registros";
          this.usuariosFiltrados.push(us);
        }

      });
    } else {
      this.usuariosFiltrados = [];
      this.usuario = new Usuario();
    }


  }

  fijarClientesBusqueda(u: Usuario) {
    // this.archivos = [];
    this.usuariosFiltrados = [];
    this.usuario = u;
   // this.producto.usuario = u;

    //this.archivos = m.files;
    this.inputElementSearch.nativeElement.value = u.apellidos + " " + u.nombres;
  }


  seleccionarArchivo(event) {

    if (event.target.files.length > 0) {
      console.log(event.target.files);
      this.archivo = new FileItem(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = e => this.archivo.imgPreview = reader.result as string;
      reader.readAsDataURL(this.archivo.archivo);
      this.archivos.push(this.archivo);

    }
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



        this.producto.files.forEach(f => {
          if (f.id == file.id) {
            f.elimina = true;
          }
        });


        this.service.eliminarImagenes(this.producto).subscribe(u => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Eliminación',
            html: "Imagen Eliminada con éxito",
            showConfirmButton: true,
            timer: 1200
          }
          );

          console.log("Ya se elimino");
          console.log(u);
          this.producto = u;
          this.archivos = u.files;
          //this.producto.files = [];
          //this.producto.files=u.files;
          //this.archivos = [];


        });

      }
    });

  }

  onCheckboxChangeEntrega(event: any) {
    if (event.target.checked) {
      this.activarEntrega = true;
      this.miFormulario.get('direccion_entrega.provincia')?.setValidators([Validators.required]);

    } else {
      this.activarEntrega = false;
      this.miFormulario.get('direccion_entrega.provincia')?.clearValidators();
      this.miFormulario.get('direccion_entrega.provincia')?.updateValueAndValidity();


    }
  }



  onCheckboxChangeCliente(event: any) {
    if (event.target.checked) {
      this.activarCliente = true;
      // this.miFormulario.get('direccion_entrega.provincia')?.setValidators([Validators.required]);
    } else {
      this.activarCliente = false;
    }
  }



  resetMaterial() {
    //this.material = new Material();
    this.archivos = [];
    //this.miFormulario.reset();
    //this.miFormulario.controls["material_unidad"].patchValue('');
    //this.miFormulario.controls["material_tipo"].patchValue('');
    this.isEdit = 0;
  }

  seleccionarArchivo22(event) {

    if (event.target.files.length > 0) {

      console.log(event.target.files);
      this.archivo = new FileItem(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = e => this.archivo.imgPreview = reader.result as string;
      reader.readAsDataURL(this.archivo.archivo);
      this.archivos.push(this.archivo);

    }

  }


  subirImagenes22() {

    const mat: Producto = new Producto();
    mat.id = this.producto.id;
    mat.files = [];

    this.archivos.forEach(f => {
      mat.files.push(f);
    });


    console.log("GUARDAR");
    console.log(mat);
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

     // this.material = u;
      this.producto=u;

      $('#staticBackdropImagenes').modal('hide');

    });

  }

}
