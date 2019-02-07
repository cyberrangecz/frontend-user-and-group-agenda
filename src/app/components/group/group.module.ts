import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupMaterialModule} from './group-material.module';
import { GroupManagementComponent } from './group-management/group-management.component';
import { GroupTableComponent } from './group-management/group-table/group-table.component';
import {GroupRoutingModule} from './group-routing.module';
import { GroupControlsComponent } from './group-management/group-controls/group-controls.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { AddUsersToGroupComponent } from './add-users-to-group/add-users-to-group.component';
import { AddToGroupUserTableComponent } from './add-users-to-group/user-table/add-to-group-user-table.component';
import { RolesOfGroupSubtableComponent } from './group-management/roles-of-group-subtable/roles-of-group-subtable.component';
import { MembersOfGroupSubtableComponent } from './group-management/members-of-group-subtable/members-of-group-subtable.component';
import {GroupManagementService} from '../../services/group/group-management.service';
import {FormsModule} from '@angular/forms';
import {GroupFacadeModule} from '../../services/group/group-facade.module';
import {UserFacadeModule} from '../../services/user/user-facade.module';
import { AddRolesToGroupComponent } from './add-roles-to-group/add-roles-to-group.component';
import { RolesTableComponent } from './add-roles-to-group/roles-table/roles-table.component';
import {RoleFacadeModule} from '../../services/role/role-facade.module';

@NgModule({
  declarations: [
  GroupManagementComponent,
  GroupTableComponent,
  GroupControlsComponent,
  GroupEditComponent,
  AddUsersToGroupComponent,
  AddToGroupUserTableComponent,
  RolesOfGroupSubtableComponent,
  MembersOfGroupSubtableComponent,
  AddRolesToGroupComponent,
  RolesTableComponent
  ],
  imports: [
    CommonModule,
    GroupMaterialModule,
    GroupRoutingModule,
    FormsModule,
    GroupFacadeModule,
    UserFacadeModule,
    RoleFacadeModule
  ],
  providers: [
    GroupManagementService
  ],
  entryComponents: [
    GroupEditComponent,
    AddUsersToGroupComponent,
    AddRolesToGroupComponent
  ]
})
export class GroupModule {

}
