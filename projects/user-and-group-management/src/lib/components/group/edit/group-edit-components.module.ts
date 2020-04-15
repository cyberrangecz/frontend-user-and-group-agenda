import {ModuleWithProviders, NgModule} from '@angular/core';
import {GroupEditComponent} from './group-edit/group-edit.component';
import {GroupEditOverviewComponent} from './group-edit-overview.component';
import {GroupEditMaterialModule} from './group-edit-material.module';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GroupRoleAssignComponent} from './group-role-assign/group-role-assign.component';
import {Kypo2ResourceSelectorModule} from 'kypo2-user-assign';
import {Kypo2TableModule} from 'kypo2-table';
import {GroupUserAssignComponent} from './group-user-assign/group-user-assign.component';
import {KypoControlsModule} from 'kypo-controls';
import {GroupEditService} from '../../../services/group/group-edit.service';
import {GroupEditConcreteService} from '../../../services/group/group-edit-concrete.service';
import {RoleAssignService} from '../../../services/role/role-assign.service';
import {RoleAssignConcreteService} from '../../../services/role/role-assign-concrete.service';
import {UserAssignService} from '../../../services/user/user-assign.service';
import {UserAssignConcreteService} from '../../../services/user/user-assign-concrete.service';
import {UserAndGroupConfig} from '../../../model/client/user-and-group-config';
import {UserAndGroupNavigator} from '../../../services/client/user-and-group-navigator.service';
import {UserAndGroupDefaultNavigator} from '../../../services/client/user-and-group-default-navigator.service';
import {GroupEditCanDeactivate} from '../../../services/can-deactivate/group-edit-can-deactivate.service';

/**
 * Module containing necessary imports and components for group edit page
 */
@NgModule({
  declarations: [
    GroupEditOverviewComponent,
    GroupEditComponent,
    GroupRoleAssignComponent,
    GroupUserAssignComponent
  ],
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      GroupEditMaterialModule,
      Kypo2ResourceSelectorModule,
      Kypo2TableModule,
      KypoControlsModule
  ],
  exports: [
    GroupEditMaterialModule,
    GroupEditComponent,
    GroupEditOverviewComponent,
    GroupRoleAssignComponent,
    GroupUserAssignComponent
  ],
  providers: [
    GroupEditCanDeactivate,
    { provide: GroupEditService, useClass: GroupEditConcreteService },
    { provide: RoleAssignService, useClass: RoleAssignConcreteService },
    { provide: UserAssignService, useClass: UserAssignConcreteService },
    { provide: UserAndGroupNavigator, useClass: UserAndGroupDefaultNavigator }
  ]
})
export class GroupEditComponentsModule {
  static forRoot(config: UserAndGroupConfig): ModuleWithProviders<GroupEditComponentsModule> {
    return {
      ngModule: GroupEditComponentsModule,
      providers: [
        {provide: UserAndGroupConfig, useValue: config}
      ]
    };
  }
}
