import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedProvidersModule } from '../../shared-providers.module';
import { UserDetailComponentsModule } from '@cyberrangecz-platform/user-and-group-agenda/user-detail';
import { GroupDetailRoutingModule } from './user-detail-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SharedProvidersModule,
        GroupDetailRoutingModule,
        UserDetailComponentsModule,
    ],
})
export class UserDetailModule {
}
