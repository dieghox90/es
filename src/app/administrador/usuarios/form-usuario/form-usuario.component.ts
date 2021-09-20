import { RolService } from './../../Services/rol.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/Models/usuario';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../Services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Rol } from 'src/app/Models/rol';



@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.css']
})
export class FormUsuarioComponent implements OnInit {


  usuario: Usuario;
  idEdit: number=0;
  roles: Rol[];
  rol: Rol;
  cedulaAux: string = "";
  correoAux: string = "";
  cargando = false;

  miFormulario: FormGroup = this.fb.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    correo: ['', [Validators.required]],
    celular: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    activado: [''],
    roles: [[], [Validators.required]],
   // password: ['', Validators.minLength(8)],
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
    private router: Router,
    private serviceRol: RolService) {
    this.usuario = new Usuario();
    this.usuario.roles = [];
    this.rol = new Rol();
  }

  ngOnInit(): void {

    this.serviceRol.listar().subscribe(r => {
      this.roles = r;
    });



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
        this.cedulaAux = us.cedula;
        this.correoAux = us.correo;

        // ---- Fijar las Unidades en el formulario -----
        this.miFormulario.controls["roles"].patchValue(this.roles.find(r => r.id === us.roles[0].id));



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
    this.usuario.roles = [];
    let us = new Usuario();
    us.roles = [];

    // Esto se hace porque los roles trabajamos con listas y no tener problemas de JACKSON EN SPRING
    us = this.usuario;
    us.roles.push(this.miFormulario.controls['roles'].value as Rol);
    //ub.roles.push(this.miFormulario.controls['rol'].value);
    //this.usuario.roles.push(this.miFormulario.controls['rol'].value);


    this.cargando = true;

    this.service.getUsuarioPorCedulaOcorreo(us.cedula, us.correo).subscribe(u => {
      let bandera = false;
      if (u!.length > 0 || u!=null) {


        u.forEach(us => {
      
          if (us.id != this.idEdit) {
            bandera = true;
          }

        });
        if (bandera) { //Para la actualizacion
          Swal.fire('Error', 'Ya existe un usuario con esa cédula o correo', 'error');
          this.cargando = false;
        } else {
          // ----- Para actualizar o guardar -----
          if (this.idEdit != 0) {
            //----- -ACTUALIZAMOS-------
            us.id = this.idEdit;
            this.usuario.username = this.usuario.correo;
            this.service.actualizarUsuario(us).subscribe(u => {
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
              this.idEdit = 0;
              this.cargando = false;
            });

          } else {
            //----- GUARDAMOS -------
            us.activado = true;
            this.service.agregarUsuario(us).subscribe(u => {
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
              this.idEdit = 0;
              this.cargando = false;
            });

          }
        }

      } else {
        this.cargando = false;
      }


    });




  }


}
