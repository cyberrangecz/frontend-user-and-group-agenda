import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {Kypo2MicroserviceEditMaterialModule} from './kypo2-microservice-edit-material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {Kypo2MicroserviceEditOverviewComponent} from './kypo2-microservice-edit-overview.component';
import {MicroserviceEditComponent} from './microservice-edit/microservice-edit.component';
import {MicroserviceEditControlsComponent} from './microservice-edit-controls/microservice-edit-controls.component';
import {MicroserviceRoleListComponent} from './microservice-role-list/microservice-role-list.component';
import {MicroserviceRoleComponent} from './microservice-role-list/microservice-role/microservice-role.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Kypo2MicroserviceEditMaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [
    Kypo2MicroserviceEditOverviewComponent,
    MicroserviceEditComponent,
    MicroserviceEditControlsComponent,
    MicroserviceRoleListComponent,
    MicroserviceRoleComponent
  ],
  exports: [
    Kypo2MicroserviceEditMaterialModule,
    Kypo2MicroserviceEditOverviewComponent,
    MicroserviceEditComponent,
    MicroserviceEditControlsComponent,
    MicroserviceRoleListComponent,
    MicroserviceRoleComponent
  ]
})
export class Kypo2MicroserviceEditComponentsModule {
}
