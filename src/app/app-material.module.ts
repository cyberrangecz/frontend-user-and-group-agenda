import {NgModule} from '@angular/core';
import {MatButtonModule, MatIconModule, MatSnackBarModule, MatTabsModule} from '@angular/material';

@NgModule({
  imports: [
    MatTabsModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  exports: [
    MatTabsModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule
  ]
})
export class AppMaterialModule {

}
