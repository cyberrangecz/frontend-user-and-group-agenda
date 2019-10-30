import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {Kypo2MicroserviceMaterialModule} from './kypo2-microservice-material.module';

import {UserAndGroupManagementConfig} from '../../config/user-and-group-management-config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    Kypo2MicroserviceMaterialModule,
  ],
  exports: []
})
export class Kypo2MicroserviceModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2MicroserviceModule) {
    if (parentModule) {
      throw new Error(
        'MicroserviceModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupManagementConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2MicroserviceModule,
      providers: [
        {provide: UserAndGroupManagementConfig, useValue: config}
      ]
    };
  }
}
