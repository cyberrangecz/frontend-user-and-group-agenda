import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

/**
 * Material components imports for user module
 */
@NgModule({
  imports: [MatListModule, MatIconModule, MatProgressBarModule, MatDialogModule, MatButtonModule, MatTooltipModule],
  exports: [MatListModule, MatIconModule, MatProgressBarModule, MatDialogModule, MatButtonModule, MatTooltipModule],
})
export class UserMaterialModule {}
