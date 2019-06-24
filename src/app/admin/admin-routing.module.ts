import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminOverviewComponent} from './admin-overview.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminOverviewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(ADMIN_ROUTES)],
  exports: [RouterModule]
})
export class AdminRoutingModule {

}
