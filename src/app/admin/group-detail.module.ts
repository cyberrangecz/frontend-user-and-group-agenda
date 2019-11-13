import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupDetailRoutingModule} from './group-detail-routing.module';
import {GroupResolver} from './resolver/group-resolver.service';
import {Kypo2GroupEditModule} from '../../../projects/user-and-group-management/src/lib/components/group/group-edit-overview/kypo2-group-edit.module';

@NgModule({
  imports: [
    CommonModule,
    GroupDetailRoutingModule,
    Kypo2GroupEditModule
  ],
  providers: [
    GroupResolver
  ]
})
export class GroupDetailModule {

}
