import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {UserAndGroupConfig} from '../../config/user-and-group-config';
import {Kypo2UserOverviewService} from '../../services/user/kypo2-user-overview.service';
import {UserOverviewConcreteService} from '../../services/user/user-overview-concrete.service';
import {Kypo2UserComponentsModule} from './kypo2-user-components.module';
import {CommonModule} from '@angular/common';
import {UserApi} from '../../services/api/user/user-api.service';
import {UserDefaultApi} from '../../services/api/user/user-default-api.service';

/**
 * Main module containing necessary imports, exports and providers for user related components
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    { provide: UserApi, useClass: UserDefaultApi },
    { provide: Kypo2UserOverviewService, useClass: UserOverviewConcreteService }
  ],
  exports: [
    Kypo2UserComponentsModule
  ]
})
export class Kypo2UserModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2UserModule) {
    if (parentModule) {
      throw new Error(
        'Kypo2UserModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupConfig): ModuleWithProviders<Kypo2UserModule> {
    return {
      ngModule: Kypo2UserModule,
      providers: [
        {provide: UserAndGroupConfig, useValue: config}
      ]
    };
  }
}
