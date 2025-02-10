import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Material components imports for user module
 */
@NgModule({
  imports: [MatListModule, MatIconModule, MatProgressBarModule, MatDialogModule, MatButtonModule, MatTooltipModule],
  exports: [MatListModule, MatIconModule, MatProgressBarModule, MatDialogModule, MatButtonModule, MatTooltipModule],
})
export class UserMaterialModule {}
