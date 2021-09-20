import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaProductosComponent } from './producto/lista-productos/lista-productos.component';
import { TipoProductoComponent } from './producto/tipo-producto/tipo-producto.component';
import { FormProductoComponent } from './producto/form-producto/form-producto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared-routing.module';
import { PerfilComponent } from './perfil/perfil.component';
import { VerComponent } from './producto/ver/ver.component';
import { AsistenciasComponent } from './asistencias/asistencias.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
//import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';




@NgModule({
  declarations: [
    ListaProductosComponent,
    TipoProductoComponent,
    FormProductoComponent,
    PerfilComponent,
    VerComponent,
    AsistenciasComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    //MatMomentDateModule,
    MatInputModule
  ]
})
  
export class SharedModule { }
