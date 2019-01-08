import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMaterialModule} from './user-material.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserTableComponent } from './user-management/user-table/user-table.component';
import {UserRoutingModule} from './user-routing.module';

@NgModule({
  declarations: [
  UserManagementComponent,
  UserTableComponent
  ],
  imports: [
    CommonModule,
    UserMaterialModule,
    UserRoutingModule
  ],
  providers: [
  ]
})
export class UserModule {

}
