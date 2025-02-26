import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailComponent } from './user-detail.component';
import { UserDetailMaterialModule } from './user-detail-material.module';
import { MatExpansionModule } from '@angular/material/expansion';

/**
 * Module containing component and providers for user detail page
 */
@NgModule({
    declarations: [UserDetailComponent],
    imports: [CommonModule, UserDetailMaterialModule, MatExpansionModule],
    providers: [],
})
export class UserDetailComponentsModule {}
