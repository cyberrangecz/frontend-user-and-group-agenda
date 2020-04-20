import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { KypoUserAndGroupApiModule } from 'kypo-user-and-group-api';
import { MicroserviceEditComponentsModule } from '../../../../../projects/user-and-group-management/src/public_api';
import { agendaConfig, apiConfig } from '../../../config';
import { SharedProvidersModule } from '../../shared-providers.module';
import { MicroserviceNewRoutingModule } from './microservice-new-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedProvidersModule,
    MicroserviceNewRoutingModule,
    MicroserviceEditComponentsModule.forRoot(agendaConfig),
    KypoUserAndGroupApiModule.forRoot(apiConfig),
  ],
})
export class MicroserviceNewModuleModule {}
