import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupMaterialModule} from './group-material.module';
import { GroupManagementComponent } from './group-management/group-management.component';
import { GroupTableComponent } from './group/management/group-table/group-table.component';

@NgModule({
  declarations: [
  GroupManagementComponent,
  GroupTableComponent],
  imports: [
    CommonModule,
    GroupMaterialModule
  ],
  providers: [

  ]
})
export class GroupModule {

}
