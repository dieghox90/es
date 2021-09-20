import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from '../login/Services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
        private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {


        return next.handle(req).pipe(
            catchError(e => {
                if (e.status == 401) {
                    if (this.authService.isAuthenticated()) {

                        this.authService.logout();
                    }
                    this.router.navigate(['/login']);
                }

                //esta autenticado pero no tiene los roless asi que se va al home
                
                if (e.status == 403) {
                    Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso!`, 'warning');
                    this.router.navigate(['/login']);
                }


                return throwError(e);
            })
        );
    }
}