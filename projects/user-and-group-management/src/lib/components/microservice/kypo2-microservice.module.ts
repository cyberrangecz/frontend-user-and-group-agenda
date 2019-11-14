import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {Kypo2MicroserviceMaterialModule} from './kypo2-microservice-material.module';
import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';
import {MicroserviceOverviewComponent} from './microservice-overview.component';
import {MicroserviceCreateComponent} from './microservice-create/microservice-create.component';
import {MicroserviceControlsComponent} from './microservice-controls/microservice-controls.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MicroserviceRoleListComponent} from './microservice-role-forms/microservice-role-list.component';
import {MicroserviceRoleComponent} from './microservice-role-forms/microservice-role/microservice-role.component';
import {MicroserviceFacadeModule} from '../../services/facade/microservice/microservice-facade.module';

@NgModule({
  declarations: [
    MicroserviceOverviewComponent,
    MicroserviceCreateComponent,
    MicroserviceControlsComponent,
    MicroserviceRoleListComponent,
    MicroserviceRoleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MicroserviceFacadeModule,
    Kypo2MicroserviceMaterialModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class Kypo2MicroserviceModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2MicroserviceModule) {
    if (parentModule) {
      throw new Error(
        'MicroserviceModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupManagementConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2MicroserviceModule,
      providers: [
        {provide: UserAndGroupManagementConfig, useValue: config}
      ]
    };
  }
}
