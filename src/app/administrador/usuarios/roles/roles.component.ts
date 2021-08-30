import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Rol } from 'src/app/Models/rol';
import Swal from 'sweetalert2';
import { RolService } from '../../Services/rol.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  isEdit: number;
  rol: Rol;
  roles: Rol[] = [];

  miFormulario: FormGroup = this.fb.group({
    id: [''],
    etiqueta: ['', [Validators.required]],
    nombre: [''],
  });

  constructor(
    private service:RolService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.rol = new Rol();
    this.isEdit = 0;
   }

  ngOnInit(): void {

    this.service.listar().subscribe(tps => {
      this.roles = tps;
    });

  }

  guardarOactualizar() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      this.toastr.error('Complete los campos correctamente', 'Validación')
      return;
    }
    const formValue = { ...this.miFormulario.value };

    this.rol = formValue;



  // ----- Para actualizr o guardar -----
    
    
    if (this.isEdit) {
      //----- -ACTUALIZAMOS-------
      this.rol.id = this.isEdit;
      this.service.actualizar(this.rol).subscribe(m => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Actualizacion',
          html: "Tipo de material <strong>" + this.rol.nombre + "</strong> Actualizado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
   
        // Para actualizar en la vista
        let itemIndex = this.roles.findIndex(item => item.id == m.id);
        this.roles[itemIndex] = m;
  

        this.miFormulario.reset();
        this.rol = new Rol();
        this.isEdit = 0;
     
      });

    } else {
      //----- GUARDAMOS -------
      this.service.agregar(this.rol).subscribe(tip => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro',
          html: "Rol <strong>" + this.rol.nombre + "</strong> Registrado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
        this.roles.push(tip);
        this.miFormulario.reset();
        this.rol = new Rol();
      });
  
    }
    
  }

  fijarEdicion(r:Rol) {
    this.rol = r;
    this.miFormulario.patchValue(r);
    this.isEdit = r.id;

  }

  campoNoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }

}
