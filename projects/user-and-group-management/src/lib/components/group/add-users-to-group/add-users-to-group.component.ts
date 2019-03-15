import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Group} from '../../../model/group/group.model';
import {AlertService} from '../../../services/alert/alert.service';
import {GroupFacadeService} from '../../../services/group/group-facade.service';
import {DialogResultEnum} from '../../../model/enums/dialog-result.enum';
import {User} from '../../../model/user/user.model';
import {Alert} from '../../../model/alert/alert.model';
import {AlertType} from '../../../model/enums/alert-type.enum';

@Component({
  selector: 'kypo2-add-users-to-group',
  templateUrl: './add-users-to-group.component.html',
  styleUrls: ['./add-users-to-group.component.css']
})
export class AddUsersToGroupComponent implements OnInit {

  selectedUsers: User[];

  constructor(@Inject(MAT_DIALOG_DATA) public group: Group,
              public dialogRef: MatDialogRef<AddUsersToGroupComponent>,
              private groupFacadeService: GroupFacadeService,
              private alertService: AlertService) {
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

  private isValidInput(): boolean {
    const potentionalErrorMessage = this.validateInput();
    if (potentionalErrorMessage !== '') {
      this.alertService.addAlert(new Alert(AlertType.ERROR, potentionalErrorMessage));
      return false;
    }
    return true;
  }

  private sendAddUsersToGroupRequest() {
    this.groupFacadeService.addUsersToGroup(this.group.id,
      this.selectedUsers.map(user => user.id))
      .subscribe(
        resp => {
          this.dialogRef.close(DialogResultEnum.SUCCESS);
        },
        err => {
          this.alertService.addAlert(new Alert(AlertType.ERROR, 'Adding users to group failed'), err);
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
