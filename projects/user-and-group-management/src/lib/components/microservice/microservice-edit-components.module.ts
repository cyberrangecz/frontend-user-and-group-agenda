import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserAndGroupConfig } from '../../model/client/user-and-group-config';
import { MicroserviceApi } from '../../services/api/microservice/microservice-api.service';
import { MicroserviceDefaultApi } from '../../services/api/microservice/microservice-default-api.service';
import { MicroserviceEditCanDeactivate } from '../../services/can-deactivate/microservice-edit-can-deactivate.service';
import { UserAndGroupDefaultNavigator } from '../../services/client/user-and-group-default-navigator.service';
import { UserAndGroupNavigator } from '../../services/client/user-and-group-navigator.service';
import { InternalSharedModule } from '../shared/internal-shared.module';
import { MicroserviceEditControlsComponent } from './microservice-edit-controls/microservice-edit-controls.component';
import { MicroserviceEditMaterialModule } from './microservice-edit-material.module';
import { MicroserviceEditOverviewComponent } from './microservice-edit-overview.component';
import { MicroserviceEditComponent } from './microservice-edit/microservice-edit.component';
import { MicroserviceRoleListComponent } from './microservice-role-list/microservice-role-list.component';
import { MicroserviceRoleComponent } from './microservice-role-list/microservice-role/microservice-role.component';

/**
 * Module containing components and necessary imports for microservice edit page
 */
@NgModule({
  imports: [CommonModule, InternalSharedModule, MicroserviceEditMaterialModule, ReactiveFormsModule],
  declarations: [
    MicroserviceEditOverviewComponent,
    MicroserviceEditComponent,
    MicroserviceEditControlsComponent,
    MicroserviceRoleListComponent,
    MicroserviceRoleComponent,
  ],
  exports: [
    MicroserviceEditMaterialModule,
    MicroserviceEditOverviewComponent,
    MicroserviceEditComponent,
    MicroserviceEditControlsComponent,
    MicroserviceRoleListComponent,
    MicroserviceRoleComponent,
  ],
  providers: [
    MicroserviceEditCanDeactivate,
    { provide: MicroserviceApi, useClass: MicroserviceDefaultApi },
    { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator },
  ],
})
export class MicroserviceEditComponentsModule {
  static forRoot(config: UserAndGroupConfig): ModuleWithProviders<MicroserviceEditComponentsModule> {
    return {
      ngModule: MicroserviceEditComponentsModule,
      providers: [{ provide: UserAndGroupConfig, useValue: config }],
    };
  }
}
