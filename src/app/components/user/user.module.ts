import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMaterialModule} from './user-material.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserTableComponent } from './user-management/user-table/user-table.component';

@NgModule({
  declarations: [

  UserManagementComponent,

  UserTableComponent],
  imports: [
    CommonModule,
    UserMaterialModule
  ],
  providers: [
  ]
})
export class UserModule {

}
