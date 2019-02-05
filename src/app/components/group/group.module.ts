import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupMaterialModule} from './group-material.module';
import { GroupManagementComponent } from './group-management/group-management.component';
import { GroupTableComponent } from './group-management/group-table/group-table.component';
import {GroupRoutingModule} from './group-routing.module';
import { GroupControlsComponent } from './group-management/group-controls/group-controls.component';
import {GroupFacadeService} from '../../services/group/group-facade.service';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { AddUsersToGroupComponent } from './add-users-to-group/add-users-to-group.component';
import { AddToGroupUserTableComponent } from './add-users-to-group/user-table/add-to-group-user-table.component';
import { RolesOfGroupSubtableComponent } from './group-management/roles-of-group-subtable/roles-of-group-subtable.component';
import { MembersOfGroupSubtableComponent } from './group-management/members-of-group-subtable/members-of-group-subtable.component';
import {GroupManagementService} from '../../services/group/group-management.service';
import {FormsModule} from '@angular/forms';
import {UserFacadeService} from '../../services/user/user-facade.service';

@NgModule({
  declarations: [
  GroupManagementComponent,
  GroupTableComponent,
  GroupControlsComponent,
  GroupEditComponent,
  AddUsersToGroupComponent,
  AddToGroupUserTableComponent,
  RolesOfGroupSubtableComponent,
  MembersOfGroupSubtableComponent
  ],
  imports: [
    CommonModule,
    GroupMaterialModule,
    GroupRoutingModule,
    FormsModule
  ],
  providers: [
    GroupFacadeService,
    UserFacadeService,
    GroupManagementService
  ],
  entryComponents: [
    GroupEditComponent
  ]
})
export class GroupModule {

}
