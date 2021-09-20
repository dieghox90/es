import { UsuarioService } from 'src/app/administrador/Services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { LocalService } from 'src/app/Services/local.service';
import { Usuario } from 'src/app/Models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LayoutService } from '../Services/layout.service';


//Importando JQUERY
declare var $: any;


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  idPerfil = Number(sessionStorage.getItem("index"));
  usuario: Usuario;
  claveActual: string = "";

  bandera: boolean = false;
  show: boolean = false;
  clave1: string = "";
  clave2: string = "";


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

  constructor(
    private service: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public serviceLayout:LayoutService,
  ) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {

    this.service.getUsuarioPorId(this.idPerfil).subscribe(u => {
      this.usuario = u;
      this.miFormulario.patchValue(u);
      console.log(this.usuario);

    });
  }



  campoNoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors && this.miFormulario.controls[campo].touched;
  }

  campoNoValidoDireccion(campo: string) {
    return this.miFormulario.get(campo)?.errors && this.miFormulario.get(campo)?.touched
  }



  actualizar() {

    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      this.toastr.error('Complete los campos correctamente', 'Validación')
      return;
    }
    const formValue = { ...this.miFormulario.value };

    this.usuario = formValue;
    this.usuario.id =  this.idPerfil;
    this.service.actualizarUsuario(this.usuario).subscribe(u => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Actualizacion',
        html: "Datos actualizados con éxito",
        showConfirmButton: true,
        timer: 1200
      });

      this.usuario = u;
      $("#staticBackdrop").modal('hide');
      this.serviceLayout.fijarDatos(u.nombres, u.apellidos);
      this.serviceLayout._nombres = u.nombres;
      this.serviceLayout._apellidos = u.apellidos
    });
    
  }

  compararClaveActual() {
    this.service.getClaveEncriptada(this.usuario.password,this.claveActual).subscribe(response => {
      console.log(response);

      console.log(this.usuario.password);
      if (response == "true") {
        $('#modalClaveNueva').modal('show');
        $('#modalClaveActual').modal('hide');   
      } else {
        this.toastr.error('Clave actual incorrecta ', 'Error')
      }
    });   
  }


  compararClaves(event: any) {
    if (event.target.value != '') {
      this.show = true;
      if (this.clave1 == event.target.value) {
        this.bandera = true;
      } else {
        this.bandera = false;
      }
    } else {
      this.show = false;
    }

  }

  cambiarClave() {
    if (this.bandera == true) {
      this.usuario.password = this.clave2;
      this.service.cambiarClave(this.usuario).subscribe(res => {
        this.toastr.success('Se ha cambiado su clave con éxito', 'Cambio de Clave')
        $('#modalClaveNueva').modal('hide');
      });
    } else {
      this.toastr.warning('Las contraseñas deben coincidir ', 'Advertencia')
    }
  }

}
