import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import { GroupFacadeModule } from '../../../services/facade/group/group-facade.module';
import { UserFacadeModule } from '../../../services/facade/user/user-facade.module';
import { RoleFacadeModule } from '../../../services/facade/role/role-facade.module';
import {UserAndGroupConfig} from '../../../config/user-and-group-config';
import {Kypo2GroupOverviewService} from '../../../services/group/kypo2-group-overview.service';
import {GroupOverviewConcreteService} from '../../../services/group/group-overview.concrete.service';
import {Kypo2GroupOverviewComponentsModule} from './kypo2-group-overview-components.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    GroupFacadeModule,
    UserFacadeModule,
    RoleFacadeModule,
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
