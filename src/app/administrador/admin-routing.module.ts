import { ListaComponent } from './materiales/lista/lista.component';
import { MaterialTipoComponent } from './materiales/material-tipo/material-tipo.component';
import { MaterialUnidadComponent } from './materiales/material-unidad/material-unidad.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormUsuarioComponent } from './usuarios/form-usuario/form-usuario.component';
import { ListaUsuariosComponent } from './usuarios/lista-usuarios/lista-usuarios.component';
import { FormProveedorComponent } from './proveedores/form-proveedor/form-proveedor.component';
import { ListaProveedoresComponent } from './proveedores/lista-proveedores/lista-proveedores.component';
import { RolesComponent } from './usuarios/roles/roles.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'nuevo-usuario',
        component:FormUsuarioComponent
      },
      {
        path: 'editar-usuario/:id',
        component:FormUsuarioComponent
      },
      {
        path: 'lista-usuarios',
        component:ListaUsuariosComponent
      },
      {
        path: 'usuarios-inactivos',
        component: ListaUsuariosComponent
      },
      {
        path: 'nuevo-proveedor',
        component: FormProveedorComponent
      },
      {
        path: 'editar-proveedor/:id',
        component: FormProveedorComponent
      },
      {
        path: 'lista-proveedores',
        component: ListaProveedoresComponent
      },
      {
        path: 'inventario',
        component: ListaComponent
      },
      {
        path: 'material-unidad',
        component: MaterialUnidadComponent
      },
      { path: 'material-tipo',
        component: MaterialTipoComponent
      },
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: '**',
        redirectTo:'nuevo'
      }
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
export class AdminRoutingModule { }
