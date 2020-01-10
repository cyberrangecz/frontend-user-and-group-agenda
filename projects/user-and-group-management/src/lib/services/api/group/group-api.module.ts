import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMapperService} from '../user/user-mapper.service';
import {GroupMapperService} from './group-mapper.service';
import {GroupApi} from './group-api.service';

/**
 * Module containing providers for group api
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    GroupApi,
    UserMapperService,
    GroupMapperService
  ]
})
export class GroupApiModule {

}
