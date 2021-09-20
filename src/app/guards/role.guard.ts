import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import Swal from 'sweetalert2';
import { AuthService } from '../login/Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //cuando desde la pagina de login queremos entrar a una pagina mediante url
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }


    //let role = next.data['role'] as string;
    //console.log("ROLEEESS " + role);
    //    let role = next.data.roles.some(ai => this.authService.hasRole(ai));
    /* if (this.authService.hasRole(role)) {
       console.log("ROLEEESS IF " + role);
       return true;
     }*/




    if (next.data.role.some(ai => this.authService.hasRole(ai))) {
      let a = ai => this.authService.hasRole(ai);
      return true;
    }

    Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
    this.router.navigate(['/home']);
    return false;

  }


}


