import {NgModule} from '@angular/core';
import {SharedProvidersModule} from '../../shared-providers.module';
import {CommonModule} from '@angular/common';
import {MicroserviceEditComponentsModule} from '../../../../../projects/user-and-group-management/src/public_api';
import {CustomConfig} from '../../../custom-config';
import {MicroserviceNewRoutingModule} from './microservice-new-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    MicroserviceNewRoutingModule,
    MicroserviceEditComponentsModule.forRoot(CustomConfig)
  ]
})
export class MicroserviceNewModuleModule {

}
