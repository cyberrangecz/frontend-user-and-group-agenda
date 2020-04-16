import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import {
  CsirtMuConfirmationDialogComponent,
  CsirtMuConfirmationDialogConfig,
  CsirtMuDialogResultEnum,
} from 'csirt-mu-common';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GroupEditOverviewComponent } from '../../components/group/edit/group-edit-overview.component';

/**
 * CanDeactivate service for group edit component.
 * Usage described in @link https://angular.io/api/router/CanDeactivate
 */
@Injectable()
export class GroupEditCanDeactivate implements CanDeactivate<GroupEditOverviewComponent> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(
    component: GroupEditOverviewComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.canDeactivate()) {
      return true;
    } else {
      const dialogData = new CsirtMuConfirmationDialogConfig(
        'Unsaved changes',
        'There are some unsaved changes. Do you want to leave without saving?',
        'Cancel',
        'Leave'
      );

      const dialogRef = this.dialog.open(CsirtMuConfirmationDialogComponent, { data: dialogData });
      return dialogRef.afterClosed().pipe(
        take(1),
        map((result) => result === CsirtMuDialogResultEnum.CONFIRMED)
      );
    }
  }
}
