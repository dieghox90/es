import { MaterialUnidad } from 'src/app/Models/material-unidad';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MaterialUnidadService } from '../../Services/material-unidad.service';

@Component({
  selector: 'app-material-unidad',
  templateUrl: './material-unidad.component.html',
  styleUrls: ['./material-unidad.component.css']
})
export class MaterialUnidadComponent implements OnInit {

  isEdit: number;
  materialUnidad: MaterialUnidad;
  unidades: MaterialUnidad[] = [];

  miFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: [''],
  });

  constructor(
    private service:MaterialUnidadService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.materialUnidad = new MaterialUnidad();
    this.isEdit = 0;
   }

  ngOnInit(): void {

    this.service.listar().subscribe(u => {
      this.unidades = u;
    });

  }

  guardarOactualizar() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      this.toastr.error('Complete los campos correctamente', 'Validación')
      return;
    }
    const formValue = { ...this.miFormulario.value };

    this.materialUnidad = formValue;

  // ----- Para actualizr o guardar -----
    
  for (let index = 0; index < this.unidades.length; index++) {
    if (this.unidades[index].nombre.toLocaleLowerCase().replace(/\s/g, "") == this.materialUnidad.nombre.toLocaleLowerCase().replace(/\s/g, "")) { 
      this.toastr.error('Ya existe una Unidad con ese nombre', 'Error')
      return;
    }
  }
    
    if (this.isEdit) {
      //----- -ACTUALIZAMOS-------
      this.materialUnidad.id = this.isEdit;

      this.service.actualizar(this.materialUnidad).subscribe(m => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Actualizacion',
          html: "Tipo de material <strong>" + this.materialUnidad.nombre + "</strong> Actualizado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );

        let itemIndex = this.unidades.findIndex(item => item.id == m.id);
        this.unidades[itemIndex] = m;
  

        this.miFormulario.reset();
        this.materialUnidad = new MaterialUnidad();
        this.isEdit = 0;
     
      });

    } else {
      //----- GUARDAMOS -------
      this.service.agregar(this.materialUnidad).subscribe(u => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro',
          html: "Tipo de material <strong>" + this.materialUnidad.nombre + "</strong> Registrado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
        this.unidades.push(u);
        this.miFormulario.reset();
        this.materialUnidad = new MaterialUnidad();
      });
  
    }
    
  }

  fijarEdicion(mu:MaterialUnidad) {
    this.materialUnidad = mu;
    this.miFormulario.patchValue(mu);
    this.isEdit = this.materialUnidad.id;
  }

  campoNoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }

}
