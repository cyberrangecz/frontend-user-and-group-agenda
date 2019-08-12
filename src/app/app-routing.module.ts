import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {Kypo2AuthGuardWithLogin, Kypo2AuthProviderPickerComponent, Kypo2NotAuthGuardService} from 'kypo2-auth';

export const APP_ROUTES: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('app/admin/admin.module').then(m => m.AdminModule),
    canActivate: [Kypo2AuthGuardWithLogin]
  },
  {
    path: 'login',
    component: Kypo2AuthProviderPickerComponent,
    canActivate: [Kypo2NotAuthGuardService]
  },
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'admin'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
