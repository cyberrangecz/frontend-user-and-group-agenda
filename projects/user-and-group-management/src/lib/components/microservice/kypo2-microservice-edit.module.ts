import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserAndGroupConfig} from '../../config/user-and-group-config';
import {MicroserviceFacadeModule} from '../../services/facade/microservice/microservice-facade.module';
import {Kypo2MicroserviceEditComponentsModule} from './kypo2-microservice-edit-components.module';

@NgModule({
  imports: [
    CommonModule,
    Kypo2MicroserviceEditComponentsModule,
    MicroserviceFacadeModule,
  ],
  exports: [
    Kypo2MicroserviceEditComponentsModule
  ]
})
export class Kypo2MicroserviceEditModule {
  constructor(@Optional() @SkipSelf() parentModule: Kypo2MicroserviceEditModule) {
    if (parentModule) {
      throw new Error(
        'Kypo2MicroserviceEditModule is already loaded. Import it in the main module only');
    }
  }

  static forRoot(config: UserAndGroupConfig): ModuleWithProviders {
    return {
      ngModule: Kypo2MicroserviceEditModule,
      providers: [
        {provide: UserAndGroupConfig, useValue: config}
      ]
    };
  }
}
