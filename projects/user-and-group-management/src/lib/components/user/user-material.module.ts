import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

/**
 * Material components imports for user module
 */
@NgModule({
  imports: [MatListModule, MatIconModule],
  exports: [MatListModule, MatIconModule],
})
export class UserMaterialModule {}
