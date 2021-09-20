import { AsistenciasComponent } from './asistencias/asistencias.component';
import { VerComponent } from './producto/ver/ver.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ListaProductosComponent } from './producto/lista-productos/lista-productos.component';
import { FormProductoComponent } from './producto/form-producto/form-producto.component';
import { TipoProductoComponent } from './producto/tipo-producto/tipo-producto.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'producto-tipo',
        component: TipoProductoComponent
      },

      {
        path: 'nuevo-producto',
        component: FormProductoComponent
      },
      {
        path: 'editar-producto/:id',
        component: FormProductoComponent
      },
      {
        path: 'listar-productos',
        component: ListaProductosComponent
      },
      {
        path: 'perfil',
        component: PerfilComponent
      },
      {
        path: 'ver-producto',
        component: VerComponent
      },
      {
        path: 'asistencias',
        component: AsistenciasComponent
      },
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SharedRoutingModule { }
