import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Kypo2GroupMaterialModule } from './kypo2-group-material.module';
import { GroupManagementComponent } from './group-management/group-management.component';
import { GroupTableComponent } from './group-management/group-table/group-table.component';
import { GroupControlsComponent } from './group-management/group-controls/group-controls.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { AddUsersToGroupComponent } from './add-users-to-group/add-users-to-group.component';
import { AddToGroupUserTableComponent } from './add-users-to-group/user-table/add-to-group-user-table.component';
import { RolesOfGroupSubtableComponent } from './group-management/roles-of-group-subtable/roles-of-group-subtable.component';
import { MembersOfGroupSubtableComponent } from './group-management/members-of-group-subtable/members-of-group-subtable.component';
import { GroupSelectionService } from '../../services/facade/group/group-selection.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupFacadeModule } from '../../services/facade/group/group-facade.module';
import { UserFacadeModule } from '../../services/facade/user/user-facade.module';
import { AddRolesToGroupComponent } from './add-roles-to-group/add-roles-to-group.component';
import { RolesTableComponent } from './add-roles-to-group/roles-table/roles-table.component';
import { RoleFacadeModule } from '../../services/facade/role/role-facade.module';
import { AddToGroupGroupTableComponent } from './add-users-to-group/group-table/add-to-group-group-table.component';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../../pipes/pipes.module';
import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    Kypo2GroupMaterialModule,
    FormsModule,
    GroupFacadeModule,
    UserFacadeModule,
    RoleFacadeModule,
    PipesModule,
    ReactiveFormsModule
  ],
  declarations: [
    GroupManagementComponent,
    GroupTableComponent,
    GroupControlsComponent,
    GroupEditComponent,
    AddUsersToGroupComponent,
    AddToGroupGroupTableComponent,
    AddToGroupUserTableComponent,
    RolesOfGroupSubtableComponent,
    MembersOfGroupSubtableComponent,
    AddRolesToGroupComponent,
    RolesTableComponent
  ],
  providers: [
    GroupSelectionService,
  ],
  entryComponents: [
    GroupEditComponent,
    AddUsersToGroupComponent,
    AddRolesToGroupComponent,
  ],
  exports: [
    GroupManagementComponent
  ]
})
export class Kypo2GroupModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2GroupModule) {
    if (parentModule) {
      throw new Error(
        'GroupModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupManagementConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2GroupModule,
      providers: [
        {provide: UserAndGroupManagementConfig, useValue: config}
      ]
    };
  }
}
