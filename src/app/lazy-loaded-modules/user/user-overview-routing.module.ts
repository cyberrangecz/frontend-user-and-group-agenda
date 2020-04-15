import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserOverviewComponent} from '../../../../projects/user-and-group-management/src/public_api';

const routes: Routes = [
  {
    path: '',
    component: UserOverviewComponent,
  },
];

/**
 * Routing module training definition overview
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserOverviewRoutingModule {

}
