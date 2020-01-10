import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import { GroupApiModule } from '../../../services/api/group/group-api.module';
import { UserApiModule } from '../../../services/api/user/user-api.module';
import { RoleApiModule } from '../../../services/api/role/role-api.module';
import {UserAndGroupConfig} from '../../../config/user-and-group-config';
import {Kypo2GroupOverviewService} from '../../../services/group/kypo2-group-overview.service';
import {GroupOverviewConcreteService} from '../../../services/group/group-overview.concrete.service';
import {Kypo2GroupOverviewComponentsModule} from './kypo2-group-overview-components.module';
import {CommonModule} from '@angular/common';

/**
 * Main module containing imports, exports and providers for group overview related component
 */
@NgModule({
  imports: [
    CommonModule,
    GroupApiModule,
    UserApiModule,
    RoleApiModule,
    Kypo2GroupOverviewComponentsModule
  ],
  providers: [
    {provide: Kypo2GroupOverviewService, useClass: GroupOverviewConcreteService},
  ],
  exports: [
    Kypo2GroupOverviewComponentsModule
  ]
})
export class Kypo2GroupOverviewModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2GroupOverviewModule) {
    if (parentModule) {
      throw new Error(
        'Kypo2GroupOverviewModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2GroupOverviewModule,
      providers: [
        {provide: UserAndGroupConfig, useValue: config}
      ]
    };
  }
}
