import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/login/Services/auth.service';
import { Producto } from 'src/app/Models/producto';
import { environment } from 'src/environments/environment';
import { ProductoService } from '../../Services/producto.service';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})
export class ListaProductosComponent implements OnInit {

  producto: Producto;
  productos: Producto[] = [];
  urlBaseImg = environment.baseUrlImg;
  cliente: boolean;
  
  constructor(private service: ProductoService,
  public authService:AuthService) {
    this.producto = new Producto();
    this.cliente = false;
  }

  ngOnInit(): void {


    if (this.authService.hasRole('ROLE_CLIENTE')) {
      this.service.listarProductosCliente(Number(sessionStorage.getItem('index'))).subscribe(p => {
        this.productos = p;
        this.cliente = true;
      });

      return;
    }


    this.service.listar().subscribe(p => {
      this.productos = p;
      console.log(p);
    });
  }

}
