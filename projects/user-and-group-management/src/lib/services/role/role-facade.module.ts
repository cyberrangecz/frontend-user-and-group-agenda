import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoleMapperService} from './role-mapper.service';
import {RoleFacadeService} from './role-facade.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    RoleFacadeService,
    RoleMapperService
  ]
})
export class RoleFacadeModule {

}
