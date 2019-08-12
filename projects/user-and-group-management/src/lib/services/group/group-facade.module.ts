import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserMapperService} from '../user/user-mapper.service';
import {GroupMapperService} from './group-mapper.service';
import {GroupFacadeService} from './group-facade.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    GroupFacadeService,
    UserMapperService,
    GroupMapperService
  ]
})
export class GroupFacadeModule {

}
