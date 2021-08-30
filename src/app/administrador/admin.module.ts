import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormUsuarioComponent } from './usuarios/form-usuario/form-usuario.component';
import { ListaUsuariosComponent } from './usuarios/lista-usuarios/lista-usuarios.component';
import { FormProveedorComponent } from './proveedores/form-proveedor/form-proveedor.component';
import { ListaProveedoresComponent } from './proveedores/lista-proveedores/lista-proveedores.component';
import { ListaComponent } from './materiales/lista/lista.component';
import { MaterialTipoComponent } from './materiales/material-tipo/material-tipo.component';
import { MaterialUnidadComponent } from './materiales/material-unidad/material-unidad.component';
import { RolesComponent } from './usuarios/roles/roles.component';



@NgModule({
  declarations: [
    FormUsuarioComponent,
    ListaUsuariosComponent,
    FormProveedorComponent,
    ListaProveedoresComponent,
    ListaComponent,
    MaterialTipoComponent,
    MaterialUnidadComponent,
    RolesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule 
  ],
  providers: [
    DatePipe,
  ]
})
export class AdminModule { }
