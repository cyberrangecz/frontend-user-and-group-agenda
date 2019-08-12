import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoleFacadeService} from './role-facade.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    RoleFacadeService,
  ]
})
export class RoleFacadeModule {

}
