import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {UserApiModule} from '../../services/api/user/user-api.module';
import {UserAndGroupConfig} from '../../config/user-and-group-config';
import {Kypo2UserOverviewService} from '../../services/user/kypo2-user-overview.service';
import {UserOverviewConcreteService} from '../../services/user/user-overview-concrete.service';
import {Kypo2UserComponentsModule} from './kypo2-user-components.module';
import {CommonModule} from '@angular/common';

/**
 * Main module containing necessary imports, exports and providers for user related components
 */
@NgModule({
  imports: [
    CommonModule,
    UserApiModule
  ],
  providers: [
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

  static forRoot(config: UserAndGroupConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2UserModule,
      providers: [
        {provide: UserAndGroupConfig, useValue: config}
      ]
    };
  }
}
