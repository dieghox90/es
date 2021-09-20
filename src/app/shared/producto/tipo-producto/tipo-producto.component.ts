import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductoTipo } from 'src/app/Models/producto-tipo';
import Swal from 'sweetalert2';
import { ProductoTipoService } from '../../Services/producto-tipo.service';

@Component({
  selector: 'app-tipo-producto',
  templateUrl: './tipo-producto.component.html',
  styleUrls: ['./tipo-producto.component.css']
})
export class TipoProductoComponent implements OnInit {

  isEdit: number;
  productoTipo: ProductoTipo;
  tipos: ProductoTipo[] = [];

  miFormulario: FormGroup = this.fb.group({
    id: [''],
    nombre: ['', [Validators.required]],
    descripcion: [''],
  });

  constructor(
    private service:ProductoTipoService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {
    this.productoTipo = new ProductoTipo();
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

    this.productoTipo = formValue;

  // ----- Para actualizr o guardar -----
    
    
    if (this.isEdit) {
      //----- -ACTUALIZAMOS-------
      this.productoTipo.id = this.isEdit;
      this.service.actualizar(this.productoTipo).subscribe(m => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Actualización',
          html: "Tipo de producto <strong>" + this.productoTipo.nombre + "</strong> Actualizado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
   
        let itemIndex = this.tipos.findIndex(item => item.id == m.id);
        this.tipos[itemIndex] = m;
  

        this.miFormulario.reset();
        this.productoTipo = new ProductoTipo();
        this.isEdit = 0;
     
      });

    } else {
      //----- GUARDAMOS -------
      this.service.agregar(this.productoTipo).subscribe(tip => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro',
          html: "Tipo de Producto <strong>" + this.productoTipo.nombre + "</strong> Registrado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
        this.tipos.push(tip);
        this.miFormulario.reset();
        this.productoTipo = new ProductoTipo();
      });
  
    }
    
  }

  fijarEdicion(mt:ProductoTipo) {
    this.productoTipo = mt;
    this.miFormulario.patchValue(mt);
    this.isEdit = mt.id;

  }

  campoNoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }


}


