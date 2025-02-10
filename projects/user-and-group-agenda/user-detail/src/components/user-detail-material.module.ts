import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

/**
 * Material components imports for user detail module
 */
@NgModule({
  imports: [MatCardModule, MatIconModule, MatTooltipModule, MatListModule, MatButtonModule],
  exports: [MatCardModule, MatIconModule, MatTooltipModule, MatListModule, MatButtonModule],
})
export class UserDetailMaterialModule {}
