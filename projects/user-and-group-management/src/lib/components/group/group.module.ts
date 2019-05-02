import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupMaterialModule} from './group-material.module';
import { GroupManagementComponent } from './group-management/group-management.component';
import { GroupTableComponent } from './group-management/group-table/group-table.component';
import { GroupControlsComponent } from './group-management/group-controls/group-controls.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { AddUsersToGroupComponent } from './add-users-to-group/add-users-to-group.component';
import { AddToGroupUserTableComponent } from './add-users-to-group/user-table/add-to-group-user-table.component';
import { RolesOfGroupSubtableComponent } from './group-management/roles-of-group-subtable/roles-of-group-subtable.component';
import { MembersOfGroupSubtableComponent } from './group-management/members-of-group-subtable/members-of-group-subtable.component';
import {GroupSelectionService} from '../../services/group/group-selection.service';
import {FormsModule} from '@angular/forms';
import {GroupFacadeModule} from '../../services/group/group-facade.module';
import {UserFacadeModule} from '../../services/user/user-facade.module';
import { AddRolesToGroupComponent } from './add-roles-to-group/add-roles-to-group.component';
import { RolesTableComponent } from './add-roles-to-group/roles-table/roles-table.component';
import {RoleFacadeModule} from '../../services/role/role-facade.module';
import {AddToGroupGroupTableComponent} from './add-users-to-group/group-table/add-to-group-group-table.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
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
  imports: [
    CommonModule,
    SharedModule,
    GroupMaterialModule,
    FormsModule,
    GroupFacadeModule,
    UserFacadeModule,
    RoleFacadeModule
  ],
  providers: [
    GroupSelectionService
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
export class GroupModule {

}
