import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    NotificationResolver,
    SentinelNotificationOverviewComponent,
    SentinelNotificationOverviewModule,
} from '@sentinel/layout/notification';

@NgModule({
    imports: [
        CommonModule,
        SentinelNotificationOverviewModule,
        RouterModule.forChild([
            {
                path: '',
                component: SentinelNotificationOverviewComponent,
            },
            {
                path: ':id',
                loadChildren: () => import('./notification-detail.module').then((m) => m.NotificationDetailModule),
                data: { breadcrumb: 'Detail' },
                resolve: { sentinelNotification: NotificationResolver },
            },
        ]),
    ],
})
export class NotificationsOverviewModule {
}
