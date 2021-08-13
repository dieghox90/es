import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Material } from 'src/app/Models/material';
import Swal from 'sweetalert2';
import { MaterialService } from '../../Services/material.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {


  isEdit: number = 0;
  material: Material;

  miFormulario: FormGroup = this.fb.group({
    codigo: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    cantidad: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private service:MaterialService
  ) {
    this.material = new Material();
     }

  ngOnInit(): void {
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

    this.material = formValue;

  // ----- Para actualizr o guardar -----
    
    if (this.isEdit!=0) {
      //------- ACTUALIZAMOS ---------
      this.material.id = this.isEdit;
      this.service.actualizar(this.material).subscribe(u => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Actualizacion',
          html: "Material <strong>" + this.material.nombre + "</strong> Actualizado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
        this.miFormulario.reset();
        this.material = new Material();
      });

    } else {
      //--------- GUARDAMOS -------------
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
        this.material = new Material();
      });
  
    }
    
  }

}
