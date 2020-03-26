import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {UserAndGroupConfig} from '../../../config/user-and-group-config';
import {Kypo2GroupOverviewService} from '../../../services/group/kypo2-group-overview.service';
import {GroupOverviewConcreteService} from '../../../services/group/group-overview.concrete.service';
import {Kypo2GroupOverviewComponentsModule} from './kypo2-group-overview-components.module';
import {CommonModule} from '@angular/common';
import {UserApi} from '../../../services/api/user/user-api.service';
import {UserDefaultApi} from '../../../services/api/user/user-default-api.service';
import {RoleApi} from '../../../services/api/role/role-api.service';
import {RoleDefaultApi} from '../../../services/api/role/role-default-api.service';
import {GroupApi} from '../../../services/api/group/group-api.service';
import {GroupDefaultApi} from '../../../services/api/group/group-default-api.service';

/**
 * Main module containing imports, exports and providers for group overview related component
 */
@NgModule({
  imports: [
    CommonModule,
    Kypo2GroupOverviewComponentsModule
  ],
  providers: [
    { provide: UserApi, useClass: UserDefaultApi },
    { provide: RoleApi, useClass: RoleDefaultApi },
    { provide: GroupApi, useClass: GroupDefaultApi },
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

  static forRoot(config: UserAndGroupConfig): ModuleWithProviders<Kypo2GroupOverviewModule> {
    return {
      ngModule: Kypo2GroupOverviewModule,
      providers: [
        {provide: UserAndGroupConfig, useValue: config}
      ]
    };
  }
}
