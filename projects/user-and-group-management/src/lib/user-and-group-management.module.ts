import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {UserAndGroupManagementMaterialModule} from './user-and-group-management-material.module';
import {SharedModule} from './components/shared/shared.module';
import {CommonModule} from '@angular/common';
import {ConfigService} from './config/config.service';
import {UserAndGroupManagementConfig} from './config/user-and-group-management-config';
import {UserAndGroupManagementComponent} from './user-and-group-management.component';
import {GroupModule} from './components/group/group.module';
import {UserModule} from './components/user/user.module';

@NgModule({
  declarations: [
    UserAndGroupManagementComponent,
  ],
  imports: [
    CommonModule,
    GroupModule,
    UserModule,
    UserAndGroupManagementMaterialModule,
    SharedModule,
  ],
  providers: [
    ConfigService
  ],
  exports: [
    UserAndGroupManagementComponent
  ]
})
export class UserAndGroupManagementModule {
  constructor(@Optional() @SkipSelf() parentModule: UserAndGroupManagementModule) {
    if (parentModule) {
      throw new Error(
        'UserAndGroupManagementModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupManagementConfig): ModuleWithProviders {
    return {
      ngModule: UserAndGroupManagementModule,
      providers: [
        {provide: UserAndGroupManagementConfig, useValue: config}
      ]
    };
  }
}
