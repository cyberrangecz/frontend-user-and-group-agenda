import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMaterialModule} from './user-material.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserTableComponent } from './user-management/user-table/user-table.component';
import { UserControlsComponent } from './user-management/user-controls/user-controls.component';
import {UserManagementService} from '../../services/user/user-management.service';
import {FormsModule} from '@angular/forms';
import {PipesModule} from '../../pipes/pipes.module';
import { UserEditComponent } from './user-edit/user-edit.component';
import {UserFacadeModule} from '../../services/user/user-facade.module';
import {SharedModule} from '../shared/shared.module';
import {ConfirmationDialogComponent} from '../shared/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
  UserManagementComponent,
  UserTableComponent,
  UserControlsComponent,
  UserEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserMaterialModule,
    UserFacadeModule,
    PipesModule,
    SharedModule
  ],
  providers: [
    UserManagementService,
  ],
  entryComponents: [
    UserEditComponent,
    ConfirmationDialogComponent
  ],
  exports: [
    UserManagementComponent
  ]
})
export class UserModule {

}
