import { ProductoService } from './../../Services/producto.service';
import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/Models/producto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver',
  templateUrl: './ver.component.html',
  styleUrls: ['./ver.component.css']
})
export class VerComponent implements OnInit {


  productos: Producto[] = [];
  urlBaseImg = environment.baseUrlImg;

  constructor(
    private service:ProductoService
  ) { }

  ngOnInit(): void {


    this.service.listarProductosVenta().subscribe(p => {
      this.productos = p;
    });
  }

}
