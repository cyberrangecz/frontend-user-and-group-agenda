import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KypoControlsModule } from 'kypo-controls';
import { Kypo2TableModule } from 'kypo2-table';
import { Kypo2ResourceSelectorModule } from 'kypo2-user-assign';
import { UserAndGroupAgendaConfig } from '../../../model/client/user-and-group-agenda-config';
import { GroupEditCanDeactivate } from '../../../services/can-deactivate/group-edit-can-deactivate.service';
import { UserAndGroupDefaultNavigator } from '../../../services/client/user-and-group-default-navigator.service';
import { UserAndGroupNavigator } from '../../../services/client/user-and-group-navigator.service';
import { GroupEditConcreteService } from '../../../services/group/edit/group-edit-concrete.service';
import { GroupEditService } from '../../../services/group/edit/group-edit.service';
import { RoleAssignConcreteService } from '../../../services/role/assign/role-assign-concrete.service';
import { RoleAssignService } from '../../../services/role/assign/role-assign.service';
import { UserAssignConcreteService } from '../../../services/user/user-assign/user-assign-concrete.service';
import { UserAssignService } from '../../../services/user/user-assign/user-assign.service';
import { GroupEditMaterialModule } from './group-edit-material.module';
import { GroupEditOverviewComponent } from './group-edit-overview.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupRoleAssignComponent } from './group-role-assign/group-role-assign.component';
import { GroupUserAssignComponent } from './group-user-assign/group-user-assign.component';

/**
 * Module containing necessary imports and components for group edit page
 */
@NgModule({
  declarations: [GroupEditOverviewComponent, GroupEditComponent, GroupRoleAssignComponent, GroupUserAssignComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GroupEditMaterialModule,
    Kypo2ResourceSelectorModule,
    Kypo2TableModule,
    KypoControlsModule,
  ],
  exports: [
    GroupEditMaterialModule,
    GroupEditComponent,
    GroupEditOverviewComponent,
    GroupRoleAssignComponent,
    GroupUserAssignComponent,
  ],
  providers: [
    GroupEditCanDeactivate,
    { provide: GroupEditService, useClass: GroupEditConcreteService },
    { provide: RoleAssignService, useClass: RoleAssignConcreteService },
    { provide: UserAssignService, useClass: UserAssignConcreteService },
    { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator },
  ],
})
export class GroupEditComponentsModule {
  static forRoot(config: UserAndGroupAgendaConfig): ModuleWithProviders<GroupEditComponentsModule> {
    return {
      ngModule: GroupEditComponentsModule,
      providers: [{ provide: UserAndGroupAgendaConfig, useValue: config }],
    };
  }
}
