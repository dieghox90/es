import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Models/usuario';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialTipo } from 'src/app/Models/material-tipo';
import { MaterialTipoService } from '../../Services/material-tipo.service';


@Component({
  selector: 'app-material-tipo',
  templateUrl: './material-tipo.component.html',
  styleUrls: ['./material-tipo.component.css']
})
export class MaterialTipoComponent implements OnInit {

  isEdit: number;
  materialTipo: MaterialTipo;
  tipos: MaterialTipo[] = [];

  miFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: [''],
  });

  constructor(
    private service:MaterialTipoService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.materialTipo = new MaterialTipo();
    this.isEdit = 0;
   }

  ngOnInit(): void {

    this.service.listar().subscribe(tps => {
      this.tipos = tps;
    });

  }

  guardarOactualizar() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      this.toastr.error('Complete los campos correctamente', 'Validación')
      return;
    }
    const formValue = { ...this.miFormulario.value };

    this.materialTipo = formValue;

  // ----- Para actualizr o guardar -----
    
    if (this.isEdit) {
      //----- -ACTUALIZAMOS-------
      this.materialTipo.id = this.isEdit;

      this.service.actualizar(this.materialTipo).subscribe(m => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Actualizacion',
          html: "Tipo de material <strong>" + this.materialTipo.nombre + "</strong> Actualizado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
   
      
        for (let i = 0; i < this.tipos.length; i++) {
          
          if (this.materialTipo.id == this.tipos[i].id) {
            this.tipos[i]=this.materialTipo;
          }
        }

        this.miFormulario.reset();
        this.materialTipo = new MaterialTipo();
        this.isEdit = 0;
     
      });

    } else {
      //----- GUARDAMOS -------
      this.service.agregar(this.materialTipo).subscribe(u => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro',
          html: "Tipo de material <strong>" + this.materialTipo.nombre + "</strong> Registrado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
        this.tipos.push(this.materialTipo);
        this.miFormulario.reset();
        this.materialTipo = new MaterialTipo();
      });
  
    }
    
  }

  fijarEdicion(mt:MaterialTipo) {
    this.materialTipo = mt;
    this.miFormulario.patchValue(mt);
    this.isEdit = this.materialTipo.id;
  }

  campoNoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }


}
