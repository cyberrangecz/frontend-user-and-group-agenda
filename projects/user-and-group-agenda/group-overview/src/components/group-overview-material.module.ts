import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Material component imports for group-overview overview module
 */
@NgModule({
    imports: [MatButtonModule, MatIconModule],
    exports: [MatButtonModule, MatIconModule],
})
export class GroupOverviewMaterialModule {}
