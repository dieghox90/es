import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaProductosComponent } from './producto/lista-productos/lista-productos.component';
import { TipoProductoComponent } from './producto/tipo-producto/tipo-producto.component';
import { FormProductoComponent } from './producto/form-producto/form-producto.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared-routing.module';




@NgModule({
  declarations: [
    ListaProductosComponent,
    TipoProductoComponent,
    FormProductoComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
