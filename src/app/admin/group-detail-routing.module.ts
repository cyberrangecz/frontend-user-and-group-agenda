import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GroupEditOverviewComponent} from '../../../projects/user-and-group-management/src/lib/components/group/group-edit-overview/group-edit-overview.component';
import {GroupResolver} from './resolver/group-resolver.service';

export const GROUP_DETAIL_ROUTES: Routes = [
  {
    path: '',
    component: GroupEditOverviewComponent,
    resolve: {
      group: GroupResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(GROUP_DETAIL_ROUTES)],
  exports: [RouterModule]
})
export class GroupDetailRoutingModule {

}
