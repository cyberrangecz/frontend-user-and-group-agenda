import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  UserAndGroupAgendaConfig,
  UserAndGroupNavigator,
  UserAndGroupDefaultNavigator,
} from '@muni-kypo-crp/user-and-group-agenda';
import { InternalSharedModule } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { MicroserviceEditCanDeactivate } from '../services/microservice-edit-can-deactivate.service';
import { MicroserviceEditControlsComponent } from './microservice-edit-controls/microservice-edit-controls.component';
import { MicroserviceEditMaterialModule } from './microservice-edit-material.module';
import { MicroserviceEditOverviewComponent } from './microservice-edit-overview.component';
import { MicroserviceEditComponent } from './microservice-edit/microservice-edit.component';
import { MicroserviceRoleListComponent } from './microservice-role-list/microservice-role-list.component';
import { MicroserviceRoleComponent } from './microservice-role-list/microservice-role/microservice-role.component';

/**
 * Module containing components and necessary imports for microservice-registration state page
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
    { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator },
  ],
})
export class MicroserviceEditComponentsModule {
  static forRoot(config: UserAndGroupAgendaConfig): ModuleWithProviders<MicroserviceEditComponentsModule> {
    return {
      ngModule: MicroserviceEditComponentsModule,
      providers: [{ provide: UserAndGroupAgendaConfig, useValue: config }],
    };
  }
}
