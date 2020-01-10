import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMapperService} from './user-mapper.service';
import {UserApi} from './user-api.service';

/**
 * Module containing providers of user api
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UserApi,
    UserMapperService,
  ]
})
export class UserApiModule {
}
