import { NgModule } from '@angular/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

/**
 * Material components imports for user detail module
 */
@NgModule({
  imports: [MatCardModule, MatIconModule, MatTooltipModule, MatListModule, MatButtonModule],
  exports: [MatCardModule, MatIconModule, MatTooltipModule, MatListModule, MatButtonModule],
})
export class UserDetailMaterialModule {}
