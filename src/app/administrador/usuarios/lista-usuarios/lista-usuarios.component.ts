import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Models/usuario';
import { UsuarioService } from '../../Services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  banderaInactivos = false;
  
  constructor(private service: UsuarioService, private router:Router) { }

  ngOnInit(): void {

    if (this.router.url.includes('inactivos')) {
      
      this.service.listarUsuariosActivos(false).subscribe(us => {
        this.usuarios = us;
        this.banderaInactivos = true;
      });

    } else {
      
      this.service.listarUsuariosActivos(true).subscribe(us => {
        this.usuarios = us;
      });
    }


  

  }


  inactivar(us:Usuario) {

    Swal.fire({
      title: "INACTIVACIÓN",
      html: "¿Desea inactivar a <strong>" + us.nombres + " " + us.apellidos + "</strong>?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI"
    }).then(result => {
      if (result.value) {
        this.service.inactivar(us.id).subscribe(() => {
          Swal.fire({
            title: "INACTIVADO: ",
            html: "Usuario <strong>" + us.nombres + " " + us.apellidos + "</strong> inactivado con exito",
            icon: "success"
          });

          this.usuarios=this.usuarios.filter(usDelete => us.id != usDelete.id);
        });
      }
    });
    
  }


  activar(us:Usuario) {

    Swal.fire({
      title: "Activación",
      html: "¿Desea activar nuevamente a <strong>" + us.nombres + " " + us.apellidos + "</strong>?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI"
    }).then(result => {
      if (result.value) {
        this.service.activar(us.id).subscribe(() => {
          Swal.fire({
            title: "ACTIVACIÓN: ",
            html: "Usuario <strong>" + us.nombres + " " + us.apellidos + "</strong> activado con exito",
            icon: "success"
          });

          this.usuarios=this.usuarios.filter(usDelete => us.id != usDelete.id);
        });
      }
    });
    
  }

}
