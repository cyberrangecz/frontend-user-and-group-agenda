import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Material components imports for group detail module
 */
@NgModule({
    imports: [MatCardModule, MatIconModule, MatTooltipModule],
    exports: [MatCardModule, MatIconModule, MatTooltipModule],
})
export class GroupDetailMaterialModule {}
