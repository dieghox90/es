import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/Models/usuario';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../Services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.css']
})
export class FormUsuarioComponent implements OnInit {


  usuario: Usuario;
  idEdit:number;

  miFormulario: FormGroup = this.fb.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    correo: ['', [Validators.required]],
    celular: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    activado: [''],
    direccion: this.fb.group({
      provincia: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
    })

  });

  constructor(private service: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (!this.router.url.includes('editar')) {
      return;
    }



    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.service.getUsuarioPorId(id))
      )
      .subscribe(us => {
        this.idEdit = us.id;
        this.miFormulario.patchValue(us);

      });
  }

  campoNoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }

  campoNoValidoDireccion(campo: string) {
    return this.miFormulario.get(campo)?.errors && this.miFormulario.get(campo)?.touched
  }


  guardarOactualizar() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      this.toastr.error('Complete los campos correctamente', 'Validación')
      return;
    }
    const formValue = { ...this.miFormulario.value };

    this.usuario = formValue;

  // ----- Para actualizr o guardar -----
    
    if (this.idEdit) {
      //----- -ACTUALIZAMOS-------
      this.usuario.id = this.idEdit;
      console.log('actualizar');
      console.log(this.usuario);
      this.service.actualizarUsuario(this.usuario).subscribe(u => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Actualizacion',
          html: "Usuario <strong>" + this.usuario.nombres + "</strong> Actualizado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
        this.miFormulario.reset();
        this.usuario = new Usuario();
        this.router.navigate(['/admin/lista-usuarios']);
      });

    } else {
      //----- GUARDAMOS -------
      this.usuario.activado = true;
      this.service.agregarUsuario(this.usuario).subscribe(u => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Registro',
          html: "Usuario <strong>" + this.usuario.nombres + "</strong> Registrado con éxito",
          showConfirmButton: true,
          timer: 1200
        }
        );
        this.miFormulario.reset();
        this.usuario = new Usuario();
      });
  
    }
    
  }


}
