import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Kypo2GroupEditOverviewComponent} from '../../../projects/user-and-group-management/src/lib/components/group/group-edit-overview/kypo2-group-edit-overview.component';
import {GroupResolver} from './resolver/group-resolver.service';
import {Kypo2GroupEditCanDeactivate} from '../../../projects/user-and-group-management/src/lib/services/group/kypo2-group-edit-can-deactivate.service';

export const GROUP_DETAIL_ROUTES: Routes = [
  {
    path: '',
    component: Kypo2GroupEditOverviewComponent,
    canDeactivate: [Kypo2GroupEditCanDeactivate],
    resolve: {
      group: GroupResolver
    }
  }
];

/**
 * Example routing of group edit page with components from user and group library
 */
@NgModule({
  imports: [RouterModule.forChild(GROUP_DETAIL_ROUTES)],
  exports: [RouterModule]
})
export class GroupDetailRoutingModule {

}
