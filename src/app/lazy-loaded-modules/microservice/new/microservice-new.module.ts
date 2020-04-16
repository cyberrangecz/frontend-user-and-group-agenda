import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MicroserviceEditComponentsModule } from '../../../../../projects/user-and-group-management/src/public_api';
import { CustomConfig } from '../../../custom-config';
import { SharedProvidersModule } from '../../shared-providers.module';
import { MicroserviceNewRoutingModule } from './microservice-new-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    MicroserviceNewRoutingModule,
    MicroserviceEditComponentsModule.forRoot(CustomConfig),
  ],
})
export class MicroserviceNewModuleModule {}
