import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMaterialModule} from './user-material.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserTableComponent } from './user-management/user-table/user-table.component';
import {UserRoutingModule} from './user-routing.module';
import { UserControlsComponent } from './user-management/user-controls/user-controls.component';
import {UserFacadeService} from '../../services/user/user-facade.service';
import {UserManagementService} from '../../services/user/user-management.service';

@NgModule({
  declarations: [
  UserManagementComponent,
  UserTableComponent,
  UserControlsComponent
  ],
  imports: [
    CommonModule,
    UserMaterialModule,
    UserRoutingModule
  ],
  providers: [
    UserManagementService,
    UserFacadeService
  ]
})
export class UserModule {

}
