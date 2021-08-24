import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/administrador/Services/usuario.service';
import { Usuario } from 'src/app/Models/usuario';
import Swal from 'sweetalert2';
import { AuthService } from '../Services/auth.service';


//Importando JQUERY
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario;
  correo: string = "";
  codigo: string = "";
  
  clave1: string = "";
  clave2: string = "";
  
  bandera: boolean = false;
  show: boolean = false;

  EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  constructor(private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,) {
    this.usuario = new Usuario();
   }
  

  ngOnInit(): void {

  }

  login(): void {


    if (this.usuario.username == null || this.usuario.password == null) {
      this.toastr.error('Complete los campos correctamente', 'Error')
      return
    }

    this.authService.login(this.usuario).subscribe(res => {
      console.log(res);
      this.authService.guardarUsuario(res.access_token);
      this.authService.guardarToken(res.access_token);
      this.router.navigate(['/welcome']);
      Swal.fire('Login', 'Hola ' + this.authService.usuario.apellidos + ' has iniciado session', 'success');
    }, err => {
      if (err.status == 400) {
        Swal.fire('Error Login', 'Usuario o clave incorrectas', 'error');
      };

    });

  }

  abirModelCorreo(): void {
    $('#modalCorreo').modal('show');
  }

  enviarCodigo(): void{

    if (this.correo == null || this.correo == "") {
      this.toastr.warning('Ingrese un correo válido ', 'Correo')
      return;
    }


    if (this.EMAIL_REGEX.test(this.correo)) {
    

      this.usuarioService.enviarCorreoRecuperacion(this.correo).subscribe(res => {
        if (res == null) {
          this.toastr.error('No existe un usuario registrado con ese correo ', 'Error')
        } else {
          this.toastr.success(`${res.nombres} ${res.apellidos} Se ha enviado un mensaje a su correo`, 'Éxito')
          this.correo = "";
          $('#modalCorreo').modal('hide');
          $('#modalCodigo').modal('show');
        }
      });

    } else {
      this.toastr.warning('Ingrese un correo válido ', 'Correo')
      return;
    }
   
  }


  compararCodigo() {
    console.log(this.codigo);
    this.usuarioService.compararCodigoRecuperacion(this.codigo).subscribe(res => {
      if (res == null) {
        this.toastr.error('Codigo Incorrecto ', 'Error')
      } else {
        this.codigo = "";
        this.usuario = res;
        $('#modalCodigo').modal('hide');
        $('#modalClave').modal('show');
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
      this.usuarioService.cambiarClave(this.usuario).subscribe(res => {
        this.toastr.success('Se ha cambiado su clave con éxito', 'Clave Restablecida')
        $('#modalClave').modal('hide');
      });
    }
  }

}
