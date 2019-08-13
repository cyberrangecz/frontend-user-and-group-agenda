import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfigService} from '../config/config.service';
import {UserAndGroupManagementConfig} from '../config/user-and-group-management-config';
import {Kypo2UserAndGroupNotificationService} from '../services/alert/kypo2-user-and-group-notification.service';
import {ErrorHandlerService} from '../services/alert/error-handler.service';
import {UserModule} from './user/user.module';
import {GroupModule} from './group/group.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    UserModule,
    GroupModule
  ],
  providers: [
    ConfigService,
    Kypo2UserAndGroupNotificationService,
    ErrorHandlerService
  ],
  exports: [
    UserModule,
    GroupModule
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
        Kypo2UserAndGroupNotificationService,
        ErrorHandlerService,
        {provide: UserAndGroupManagementConfig, useValue: config}
      ]
    };
  }
}
