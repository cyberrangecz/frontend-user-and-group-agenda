import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupMaterialModule} from './group-material.module';
import { GroupManagementComponent } from './group-management/group-management.component';
import { GroupTableComponent } from './group-management/group-table/group-table.component';
import {GroupRoutingModule} from './group-routing.module';
import { GroupControlsComponent } from './group-management/group-controls/group-controls.component';
import {GroupFacadeService} from '../../services/group/group-facade.service';

@NgModule({
  declarations: [
  GroupManagementComponent,
  GroupTableComponent,
  GroupControlsComponent
  ],
  imports: [
    CommonModule,
    GroupMaterialModule,
    GroupRoutingModule
  ],
  providers: [
    GroupFacadeService
  ]
})
export class GroupModule {

}
