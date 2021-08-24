import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './login/Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  nombres: string | null;
  apellidos: string | null;

  ocultar:boolean= false;
  constructor(private router: Router, private route: ActivatedRoute,
  private authService:AuthService) {
    
  }

  ngOnInit(): void {

    this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe((e:any) => {
      
   
      if (e.urlAfterRedirects.includes('login')) {
        this.ocultar = true;
      } else {
        this.ocultar = false;
        this.nombres = sessionStorage.getItem('nombres');
        this.apellidos = sessionStorage.getItem('apellidos');
      }
    });

    
  }


  isCollapsed = false;

  logout() {
    this.authService.logout();
    this.nombres = "";
    this.apellidos = "";
    this.router.navigate(['/login']);
  }
    

}
