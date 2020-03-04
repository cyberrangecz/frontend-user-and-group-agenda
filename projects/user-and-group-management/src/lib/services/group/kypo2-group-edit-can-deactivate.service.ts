import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Kypo2GroupEditOverviewComponent} from '../../components/group/group-edit-overview/kypo2-group-edit-overview.component';
import {Observable} from 'rxjs';
import { Injectable } from "@angular/core";
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogInput} from '../../components/shared/confirmation-dialog/confirmation-dialog.input';
import {ConfirmationDialogComponent} from '../../components/shared/confirmation-dialog/confirmation-dialog.component';
import {map, take} from 'rxjs/operators';
import {DialogResultEnum} from '../../model/enums/dialog-result.enum';

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
      const dialogData = new ConfirmationDialogInput();
      dialogData.title = 'Unsaved changes';
      dialogData.content = `Do you want to leave without saving?`;

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {data: dialogData});
      return dialogRef.afterClosed()
        .pipe(
          take(1),
          map(result => result === DialogResultEnum.SUCCESS)
        );
    }
  }
}
