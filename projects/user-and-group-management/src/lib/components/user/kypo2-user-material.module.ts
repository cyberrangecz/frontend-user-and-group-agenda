import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

/**
 * Material components imports for user module
 */
@NgModule({
  imports: [
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
  exports: [
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
})
export class Kypo2UserMaterialModule {

}
