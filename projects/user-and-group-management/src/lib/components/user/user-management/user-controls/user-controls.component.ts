import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserManagementService} from '../../../../services/user/user-management.service';
import {Observable, Subscription} from 'rxjs';
import {UserFacadeService} from '../../../../services/user/user-facade.service';
import {AlertService} from '../../../../services/alert/alert.service';
import {AlertType} from '../../../../model/enums/alert-type.enum';
import {Alert} from '../../../../model/alert/alert.model';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';
import {MatDialog} from '@angular/material';
import {User} from '../../../../model/user/user.model';
import {ConfirmationDialogInputModel} from '../../../shared/confirmation-dialog/confirmation-dialog-input.model';
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import {map} from 'rxjs/operators';

@Component({
  selector: 'kypo2-user-controls',
  templateUrl: './user-controls.component.html',
  styleUrls: ['./user-controls.component.css']
})
export class UserControlsComponent implements OnInit, OnDestroy {

  private _selectedUsersSubscription: Subscription;
  selectedUsersCount = 0;

  constructor(public dialog: MatDialog,
              private userManagementService: UserManagementService,
              private userFacade: UserFacadeService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscribeSelectedUsers();
  }

  ngOnDestroy() {
    if (this._selectedUsersSubscription) {
      this._selectedUsersSubscription.unsubscribe();
    }
  }

  removeUsers() {
    this.userConfirmedRemovingSelectedUsers(this.userManagementService.getSelectedUsers())
      .subscribe(confirmed => {
        if (confirmed) {
          this.sendRemoveUsersRequest();
        }
      });
  }

  private userConfirmedRemovingSelectedUsers(usersToRemove: User[]): Observable<boolean> {
    const dialogData = new ConfirmationDialogInputModel();
    dialogData.title = 'Remove selected users';
    dialogData.content = `Do you want to remove ${usersToRemove.length} selected users from database?`;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: dialogData });
    return dialogRef.afterClosed()
      .pipe(map(result => result === DialogResultEnum.SUCCESS));
  }

  private getSelectedUserIds(): number[] {
    return this.userManagementService.getSelectedUsers()
      .map(user => user.id);
  }

  private sendRemoveUsersRequest() {
    this.userFacade.removeUsers(this.getSelectedUserIds())
      .subscribe(
        resp => {
          this.userManagementService.emitDataChange();
          this.alertService.addAlert(new Alert(AlertType.SUCCESS, 'Selected users were successfully deleted'));
        },
        err => {
          this.alertService.addAlert(new Alert(AlertType.ERROR, 'Selected users were not deleted'), {error: err});
        }
      );
  }

  private subscribeSelectedUsers() {
    this._selectedUsersSubscription = this.userManagementService.selectionChange$
      .subscribe(size =>
        this.selectedUsersCount = size);
  }
}
