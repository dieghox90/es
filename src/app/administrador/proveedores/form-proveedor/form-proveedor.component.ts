import { environment } from 'src/environments/environment';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, switchMap } from 'rxjs/operators';
import { Proveedor } from 'src/app/Models/proveedor';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../Services/proveedor.service';
import { Direccion } from 'src/app/Models/direccion';

import * as Mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { FeatureCollection } from 'geojson';
import * as Feature from 'geojson';
import { pipe } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Producto } from 'src/app/Models/producto';


@Component({
  selector: 'app-form-proveedor',
  templateUrl: './form-proveedor.component.html',
  styleUrls: ['./form-proveedor.component.css']
})


export class FormProveedorComponent implements OnInit, AfterViewInit, OnDestroy {

  idEdit: number;
  proveedor: Proveedor;
  geocoder: any;

  provincia: any;
  canton: string = "";
  coordenadasProvincia: [number, number];

  // --- Mapa -----
  @ViewChild('mapa') divMapa!: ElementRef
  mapa: mapboxgl.Map;
  marker: any;
  zoomLevel: number = 15;
  center: [number, number] = [-78.7638587,  -3.828434];


  miFormulario: FormGroup = this.fb.group({
    nombre_empresa: ['', [Validators.required]],
    representante: ['', [Validators.required]],
    cedula_ruc: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
    correo: ['', [Validators.required]],
    celular: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    telefono_fijo: [''],
    direccion: this.fb.group({
      provincia: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: [''],
    })
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: ProveedorService,
    private http: HttpClient) {
    this.proveedor = new Proveedor();
    this.proveedor.direccion = new Direccion();

  }

  //Para destruir los eventos del mapa, ya que se queda en memoria
  ngOnDestroy(): void {

    this.mapa.off('zoom', () => { });
    this.mapa.off('zoomend', () => { });
    this.mapa.off('move', () => { });
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




    // ----- Evento mover marker ----
    /*this.marker.on('dragend', () => {
      const { lng, lat } = this.marker.getLngLat();
      this.center = [lng, lat];
    });
*/

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


  ngOnInit(): void {


    if (!this.router.url.includes('editar')) {
      return;
    }


    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.service.getProveedorPorId(id))
      )
      .subscribe(pro => {
        this.idEdit = pro.id;
        this.miFormulario.patchValue(pro);

        

        this.proveedor = pro;
        // console.log(this.proveedor);


        this.marker.setLngLat([this.proveedor.direccion.longitud, this.proveedor.direccion.latitud]);
        this.mapa.setCenter([this.proveedor.direccion.longitud, this.proveedor.direccion.latitud]);





      });
  }


  guardarOactualizar() {

    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      this.toastr.error('Complete los campos correctamente', 'Validación')
      return;
    }
    const formValue = { ...this.miFormulario.value };

    this.proveedor = formValue;


    // ----- Fijamos el marcador ----

    this.proveedor.direccion.longitud = this.marker.getLngLat().lng;
    this.proveedor.direccion.latitud = this.marker.getLngLat().lat;
    
    

    // ----- Para actualizr o guardar -----
    if (this.idEdit) {
      //----- -ACTUALIZAMOS-------
      this.proveedor.id = this.idEdit;
      this.service.actualizarProveedor(this.proveedor).subscribe(u => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Actualizacion',
          html: "Proveedor <strong>" + this.proveedor.representante + "</strong> Actualizado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
        this.miFormulario.reset();
        this.proveedor = new Proveedor();
        this.router.navigate(['/admin/lista-proveedores']);
      });

    } else {
      //----- GUARDAMOS -------

      this.service.agregarProveedor(this.proveedor).subscribe(u => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro',
          html: "Proveedor <strong>" + this.proveedor.representante + "</strong> Registrado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
        this.miFormulario.reset();
        this.proveedor = new Proveedor();
      });

    }

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



  campoNoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }

  campoNoValidoDireccion(campo: string) {
    return this.miFormulario.get(campo)?.errors && this.miFormulario.get(campo)?.touched
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


}
