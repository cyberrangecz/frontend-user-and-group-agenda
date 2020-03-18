import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Kypo2GroupEditOverviewComponent} from '../../components/group/group-edit-overview/kypo2-group-edit-overview.component';
import {Observable} from 'rxjs';
import { Injectable } from "@angular/core";
import {MatDialog} from '@angular/material/dialog';
import {map, take} from 'rxjs/operators';
import {CsirtMuConfirmationDialogComponent, CsirtMuConfirmationDialogConfig, CsirtMuDialogResultEnum} from 'csirt-mu-common';

/**
 * CanDeactivate service for group edit component.
 * Usage described in @link https://angular.io/api/router/CanDeactivate
 */
@Injectable()
export class Kypo2GroupEditCanDeactivate implements CanDeactivate<Kypo2GroupEditOverviewComponent> {

  constructor(private dialog: MatDialog) {
  }

  canDeactivate(component: Kypo2GroupEditOverviewComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.canDeactivate()) {
      return true;
    } else {
      const dialogData = new CsirtMuConfirmationDialogConfig(
        'Unsaved changes',
        'There are some unsaved changes. Do you want to leave without saving?',
        'Cancel',
        'Leave'
      );

      const dialogRef = this.dialog.open(CsirtMuConfirmationDialogComponent, {data: dialogData});
      return dialogRef.afterClosed()
        .pipe(
          take(1),
          map(result => result === CsirtMuDialogResultEnum.CONFIRMED)
        );
    }
  }
}
