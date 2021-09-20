import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/Models/proveedor';
import { ProveedorService } from '../../Services/proveedor.service';

@Component({
  selector: 'app-lista-proveedores',
  templateUrl: './lista-proveedores.component.html',
  styleUrls: ['./lista-proveedores.component.css']
})
export class ListaProveedoresComponent implements OnInit {

  proveedores: Proveedor[];
  constructor(private service:ProveedorService) { }

  ngOnInit(): void {
      this.service.listarProveedoresActivos().subscribe(pro => {
        this.proveedores = pro;
      });
  }

}
