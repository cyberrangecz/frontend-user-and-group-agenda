import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserSelectionService} from '../../../../services/facade/user/user-selection.service';
import {Observable, Subscription} from 'rxjs';
import {UserFacadeService} from '../../../../services/facade/user/user-facade.service';
import {Kypo2UserAndGroupNotificationService} from '../../../../services/notification/kypo2-user-and-group-notification.service';
import {NotificationType} from '../../../../model/enums/alert-type.enum';
import {Notification} from '../../../../model/alert/alert.model';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';
import {MatDialog} from '@angular/material';
import {ConfirmationDialogInputModel} from '../../../shared/confirmation-dialog/confirmation-dialog-input.model';
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import {map} from 'rxjs/operators';
import {ErrorHandlerService} from '../../../../services/notification/error-handler.service';
import {User} from 'kypo2-auth';

@Component({
  selector: 'kypo2-user-controls',
  templateUrl: './user-controls.component.html',
  styleUrls: ['./user-controls.component.css']
})
export class UserControlsComponent implements OnInit, OnDestroy {

  private _selectedUsersSubscription: Subscription;
  selectedUsersCount = 0;

  constructor(public dialog: MatDialog,
              private userManagementService: UserSelectionService,
              private userFacade: UserFacadeService,
              private errorHandler: ErrorHandlerService,
              private alertService: Kypo2UserAndGroupNotificationService) {
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
          this.alertService.addNotification(new Notification(NotificationType.SUCCESS, 'Selected users were successfully deleted'));
        },
        err => this.errorHandler.displayInAlert(err, 'Deleting users')
      );
  }

  private subscribeSelectedUsers() {
    this._selectedUsersSubscription = this.userManagementService.selectionChange$
      .subscribe(size =>
        this.selectedUsersCount = size);
  }
}
