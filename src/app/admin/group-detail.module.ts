import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupDetailRoutingModule} from './group-detail-routing.module';
import {GroupResolver} from './resolver/group-resolver.service';
import {Kypo2GroupEditModule} from '../../../projects/user-and-group-management/src/lib/components/group/group-edit-overview/kypo2-group-edit.module';
import {Kypo2GroupResolverHelperService} from '../../../projects/user-and-group-management/src/lib/services/group/kypo2-group-resolver-helper.service';
import {Kypo2GroupEditCanDeactivate} from '../../../projects/user-and-group-management/src/lib/services/group/kypo2-group-edit-can-deactivate.service';

/**
 * Module containing necessary imports for group detail page
 */
@NgModule({
  imports: [
    CommonModule,
    GroupDetailRoutingModule,
    Kypo2GroupEditModule
  ],
  providers: [
    GroupResolver,
    Kypo2GroupResolverHelperService,
    Kypo2GroupEditCanDeactivate
  ]
})
export class GroupDetailModule {

}
