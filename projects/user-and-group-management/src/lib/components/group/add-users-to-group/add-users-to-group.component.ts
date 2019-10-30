import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Group} from '../../../model/group/group.model';
import {Kypo2UserAndGroupNotificationService} from '../../../services/notification/kypo2-user-and-group-notification.service';
import {GroupFacadeService} from '../../../services/facade/group/group-facade.service';
import {DialogResultEnum} from '../../../model/enums/dialog-result.enum';
import {Kypo2UserAndGroupNotification} from '../../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../../model/enums/alert-type.enum';
import {Kypo2UserAndGroupErrorService} from '../../../services/notification/kypo2-user-and-group-error.service';
import {User} from 'kypo2-auth';
import {Kypo2UserAndGroupError} from '../../../model/events/kypo2-user-and-group-error';

@Component({
  selector: 'kypo2-add-users-to-group',
  templateUrl: './add-users-to-group.component.html',
  styleUrls: ['./add-users-to-group.component.css']
})
export class AddUsersToGroupComponent implements OnInit {

  selectedUsers: User[] = [];
  selectedGroups: Group[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public group: Group,
              public dialogRef: MatDialogRef<AddUsersToGroupComponent>,
              private groupFacadeService: GroupFacadeService,
              private errorHandler: Kypo2UserAndGroupErrorService,
              private alertService: Kypo2UserAndGroupNotificationService) {
  }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close(DialogResultEnum.CANCELED);
  }

  save() {
    if (this.isValidInput()) {
      this.sendAddUsersToGroupRequest();
    }
  }

  onUserSelectionChanged($event: User[]) {
    this.selectedUsers = $event;
  }

  onGroupSelectionChanged($event: Group[]) {
    this.selectedGroups = $event;
  }

  private isValidInput(): boolean {
    const potentionalErrorMessage = this.validateInput();
    if (potentionalErrorMessage !== '') {
      this.alertService.notify(new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.ERROR, potentionalErrorMessage));
      return false;
    }
    return true;
  }

  private sendAddUsersToGroupRequest() {
    this.groupFacadeService.addUsersToGroup(this.group.id,
      this.selectedUsers.map(user => user.id),
      this.selectedGroups.map(group => group.id))
      .subscribe(
        resp => {
          this.dialogRef.close(DialogResultEnum.SUCCESS);
        },
        err => {
          this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Adding users to group'));
        }
      );
  }

  private validateInput(): string {
    let errorMessage = '';
    if (!this.selectedUsers || this.selectedUsers.length <= 0) {
      errorMessage += 'Users cannot be empty';
    }
    return errorMessage;
  }
}
