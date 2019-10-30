import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Kypo2UserMaterialModule} from './kypo2-user-material.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserTableComponent } from './user-management/user-table/user-table.component';
import { UserControlsComponent } from './user-management/user-controls/user-controls.component';
import {UserSelectionService} from '../../services/facade/user/user-selection.service';
import {FormsModule} from '@angular/forms';
import {PipesModule} from '../../pipes/pipes.module';
import {UserFacadeModule} from '../../services/facade/user/user-facade.module';
import {SharedModule} from '../shared/shared.module';
import { UserRolesDialogComponent } from './user-management/user-table/user-roles-dialog/user-roles-dialog.component';
import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';

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
    Kypo2UserMaterialModule,
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
export class Kypo2UserModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2UserModule) {
    if (parentModule) {
      throw new Error(
        'UserModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupManagementConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2UserModule,
      providers: [
        {provide: UserAndGroupManagementConfig, useValue: config}
      ]
    };
  }
}
