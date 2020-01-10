import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MicroserviceApi} from './microservice-api.service';
import {MicroserviceMapperService} from './microservice-mapper.service';

/**
 * Module containing providers for group api
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    MicroserviceApi,
    MicroserviceMapperService
  ]
})
export class MicroserviceApiModule { }
