import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MicroserviceFacadeService} from './microservice-facade.service';
import {MicroserviceMapperService} from './microservice-mapper.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    MicroserviceFacadeService,
    MicroserviceMapperService
  ]
})
export class MicroserviceFacadeModule { }
