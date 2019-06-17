import {NgModule} from '@angular/core';
import {MatTabsModule} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';

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
export class UserAndGroupManagementMaterialModule {

}
