import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserAndGroupConfig} from '../../config/user-and-group-config';
import {Kypo2MicroserviceEditComponentsModule} from './kypo2-microservice-edit-components.module';
import {InternalSharedModule} from '../shared/internal-shared.module';
import {MicroserviceApi} from '../../services/api/microservice/microservice-api.service';
import {MicroserviceDefaultApi} from '../../services/api/microservice/microservice-default-api.service';

/**
 * Main module containing imports, exports and providers for microservice edit related component
 */
@NgModule({
  imports: [
    CommonModule,
    Kypo2MicroserviceEditComponentsModule,
    InternalSharedModule
  ],
  exports: [
    Kypo2MicroserviceEditComponentsModule
  ],
  providers: [
    { provide: MicroserviceApi, useClass: MicroserviceDefaultApi }
  ]
})
export class Kypo2MicroserviceEditModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2MicroserviceEditModule) {
    if (parentModule) {
      throw new Error(
        'Kypo2MicroserviceEditModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupConfig): ModuleWithProviders<Kypo2MicroserviceEditModule> {
    return {
      ngModule: Kypo2MicroserviceEditModule,
      providers: [
        {provide: UserAndGroupConfig, useValue: config}
      ]
    };
  }
}
