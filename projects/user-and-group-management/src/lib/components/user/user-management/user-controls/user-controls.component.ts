import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserSelectionService} from '../../../../services/facade/user/user-selection.service';
import {Observable, Subscription} from 'rxjs';
import {UserFacadeService} from '../../../../services/facade/user/user-facade.service';
import {Kypo2UserAndGroupNotificationService} from '../../../../services/notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupNotificationType} from '../../../../model/enums/alert-type.enum';
import {Kypo2UserAndGroupNotification} from '../../../../model/events/kypo2-user-and-group-notification';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';
import {MatDialog} from '@angular/material';
import {ConfirmationDialogInputModel} from '../../../shared/confirmation-dialog/confirmation-dialog-input.model';
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import {map} from 'rxjs/operators';
import {Kypo2UserAndGroupErrorService} from '../../../../services/notification/kypo2-user-and-group-error.service';
import {User} from 'kypo2-auth';
import {Kypo2UserAndGroupError} from '../../../../model/events/kypo2-user-and-group-error';

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
              private errorHandler: Kypo2UserAndGroupErrorService,
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
          this.alertService.notify(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS, 'Selected users were successfully deleted'));
        },
        err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting users'))
      );
  }

  private subscribeSelectedUsers() {
    this._selectedUsersSubscription = this.userManagementService.selectionChange$
      .subscribe(size =>
        this.selectedUsersCount = size);
  }
}
