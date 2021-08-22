import { Component, OnInit } from '@angular/core';
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
  
  constructor(private service:ProductoService) {
    this.producto = new Producto();
  }

  ngOnInit(): void {
    this.service.listar().subscribe(p => {
      this.productos = p
    });
  }

}
