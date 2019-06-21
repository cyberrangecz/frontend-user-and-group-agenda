import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

export const APP_ROUTES: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('app/admin/admin.module').then(m => m.AdminModule),
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
