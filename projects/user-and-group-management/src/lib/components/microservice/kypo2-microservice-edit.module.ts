import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {Kypo2MicroserviceEditMaterialModule} from './kypo2-microservice-edit-material.module';
import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';
import {MicroserviceEditOverviewComponent} from './microservice-edit-overview.component';
import {MicroserviceEditComponent} from './microservice-edit/microservice-edit.component';
import {MicroserviceEditControlsComponent} from './microservice-edit-controls/microservice-edit-controls.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MicroserviceRoleListComponent} from './microservice-role-list/microservice-role-list.component';
import {MicroserviceRoleComponent} from './microservice-role-list/microservice-role/microservice-role.component';
import {MicroserviceFacadeModule} from '../../services/facade/microservice/microservice-facade.module';

@NgModule({
  declarations: [
    MicroserviceEditOverviewComponent,
    MicroserviceEditComponent,
    MicroserviceEditControlsComponent,
    MicroserviceRoleListComponent,
    MicroserviceRoleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MicroserviceFacadeModule,
    Kypo2MicroserviceEditMaterialModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class Kypo2MicroserviceEditModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2MicroserviceEditModule) {
    if (parentModule) {
      throw new Error(
        'MicroserviceModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupManagementConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2MicroserviceEditModule,
      providers: [
        {provide: UserAndGroupManagementConfig, useValue: config}
      ]
    };
  }
}
