import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMaterialModule} from './user-material.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserTableComponent } from './user-management/user-table/user-table.component';
import { UserControlsComponent } from './user-management/user-controls/user-controls.component';
import {UserSelectionService} from '../../services/user/user-selection.service';
import {FormsModule} from '@angular/forms';
import {PipesModule} from '../../pipes/pipes.module';
import {UserFacadeModule} from '../../services/user/user-facade.module';
import {SharedModule} from '../shared/shared.module';
import {ConfirmationDialogComponent} from '../shared/confirmation-dialog/confirmation-dialog.component';
import { UserRolesDialogComponent } from './user-management/user-table/user-roles-dialog/user-roles-dialog.component';

@NgModule({
  declarations: [
  UserManagementComponent,
  UserTableComponent,
  UserControlsComponent,
  UserRolesDialogComponent,
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
    UserSelectionService,
  ],
  entryComponents: [
    UserRolesDialogComponent
  ],
  exports: [
    UserManagementComponent
  ]
})
export class UserModule {

}
