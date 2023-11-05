import { NgModule } from '@angular/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

/**
 * Material components imports for group detail module
 */
@NgModule({
  imports: [MatCardModule, MatIconModule, MatTooltipModule],
  exports: [MatCardModule, MatIconModule, MatTooltipModule],
})
export class GroupDetailMaterialModule {}
