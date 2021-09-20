import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../login/Services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private authService: AuthService,
    private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      if (this.isTokenExpirado()) {
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;

      }
      return true;

    }

    this.router.navigate(['/login']);
    return false;

  }

  public isTokenExpirado(): boolean {
    let token = this.authService.token;
    let payload = this.authService.obtenerToken(token);
    let now = new Date().getTime() / 1000; //fechas en segundos
    if (payload.exp < now) {
      return true;
    }
    return false;
  }

}
