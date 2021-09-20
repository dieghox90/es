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
  idEdit: number = 0;
  roles: Rol[];
  rol: Rol;
  cedulaAux: string = "";
  correoAux: string = "";
  cargando = false;

  miFormulario: FormGroup = this.fb.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    correo: ['', [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
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


    // ---- VALIDAR CEDULA ECUATORIANA --------


    if (!this.validarCedula(us.cedula)) {
      this.toastr.error('La cédula no es válida ', 'Cédula Validación');
      return;
    }

    this.cargando = true;

    this.service.getUsuarioPorCedulaOcorreo(us.cedula, us.correo).subscribe(u => {
      let bandera = false;
      if (u!.length > 0 || u != null) {


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


  validarCedula(cedula: string) {
    // Créditos: Victor Diaz De La Gasca.
    // Autor: Adrián Egüez
    // Preguntamos si la cedula consta de 10 digitos
    if (cedula.length === 10) {

      // Obtenemos el digito de la region que sonlos dos primeros digitos
      const digitoRegion = cedula.substring(0, 2);

      // Pregunto si la region existe ecuador se divide en 24 regiones
      if (digitoRegion >= String(1) && digitoRegion <= String(24)) {

        // Extraigo el ultimo digito
        const ultimoDigito = Number(cedula.substring(9, 10));

        // Agrupo todos los pares y los sumo
        const pares = Number(cedula.substring(1, 2)) + Number(cedula.substring(3, 4)) + Number(cedula.substring(5, 6)) + Number(cedula.substring(7, 8));

        // Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
        let numeroUno: any = cedula.substring(0, 1);
        numeroUno = (numeroUno * 2);
        if (numeroUno > 9) {
          numeroUno = (numeroUno - 9);
        }

        let numeroTres: any = cedula.substring(2, 3);
        numeroTres = (numeroTres * 2);
        if (numeroTres > 9) {
          numeroTres = (numeroTres - 9);
        }

        let numeroCinco: any = cedula.substring(4, 5);
        numeroCinco = (numeroCinco * 2);
        if (numeroCinco > 9) {
          numeroCinco = (numeroCinco - 9);
        }

        let numeroSiete: any = cedula.substring(6, 7);
        numeroSiete = (numeroSiete * 2);
        if (numeroSiete > 9) {
          numeroSiete = (numeroSiete - 9);
        }

        let numeroNueve: any = cedula.substring(8, 9);
        numeroNueve = (numeroNueve * 2);
        if (numeroNueve > 9) {
          numeroNueve = (numeroNueve - 9);
        }

        const impares = numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;

        // Suma total
        const sumaTotal = (pares + impares);

        // extraemos el primero digito
        const primerDigitoSuma = String(sumaTotal).substring(0, 1);

        // Obtenemos la decena inmediata
        const decena = (Number(primerDigitoSuma) + 1) * 10;

        // Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
        let digitoValidador = decena - sumaTotal;

        // Si el digito validador es = a 10 toma el valor de 0
        if (digitoValidador === 10) {
          digitoValidador = 0;
        }

        // Validamos que el digito validador sea igual al de la cedula
        if (digitoValidador === ultimoDigito) {
          return true;
        } else {
          return false;
        }

      } else {
        // imprimimos en consola si la region no pertenece
        return false;
      }
    } else {
      // Imprimimos en consola si la cedula tiene mas o menos de 10 digitos
      return false;
    }

  }


}
