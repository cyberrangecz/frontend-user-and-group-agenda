import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoleApi} from './role-api.service';

/**
 * Module containing providers for roles api
 */
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    RoleApi,
  ]
})
export class RoleApiModule {

}
