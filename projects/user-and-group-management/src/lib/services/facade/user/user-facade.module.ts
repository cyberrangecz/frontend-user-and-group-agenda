import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMapperService} from './user-mapper.service';
import {UserFacadeService} from './user-facade.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UserFacadeService,
    UserMapperService,
  ]
})
export class UserFacadeModule {
}
