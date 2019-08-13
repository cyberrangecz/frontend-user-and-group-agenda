import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Group} from '../../../model/group/group.model';
import {GroupFacadeService} from '../../../services/group/group-facade.service';
import {Kypo2UserAndGroupNotificationService} from '../../../services/alert/kypo2-user-and-group-notification.service';
import {Notification} from '../../../model/alert/alert.model';
import {NotificationType} from '../../../model/enums/alert-type.enum';
import {DialogResultEnum} from '../../../model/enums/dialog-result.enum';
import {ErrorHandlerService} from '../../../services/alert/error-handler.service';
import {User} from 'kypo2-auth';

@Component({
  selector: 'kypo2-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {

  editMode = false;

  name: string;
  description: string;
  expirationDate: Date;
  tomorrow: Date;
  users: User[] = [];
  groups: Group[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public group: Group,
              public dialogRef: MatDialogRef<GroupEditComponent>,
              private groupFacade: GroupFacadeService,
              private errorHandler: ErrorHandlerService,
              private alertService: Kypo2UserAndGroupNotificationService) {
  }

  ngOnInit() {
    const today = new Date();
    this.tomorrow = new Date(new Date(today.setDate(today.getDate() + 1)).setHours(0, 0 , 0));
    if (this.group) {
      this.resolveInitialValues();
    }
  }

  cancel() {
    this.dialogRef.close(DialogResultEnum.CANCELED);
  }

  save() {
    if (this.isValidInput()) {
      const editedGroup = this.setValuesToGroupObject();
      this.sendSaveRequest(editedGroup);
    }
  }

  onUserSelectionChanged($event: User[]) {
    this.users = $event;
  }

  onGroupSelectionChanged($event: Group[]) {
    this.groups = $event;
  }

  private resolveInitialValues() {
    if (this.group) {
      this.editMode = true;
      this.setValuesFromGroup();
    }
  }

  private setValuesFromGroup() {
    this.name = this.group.name;
    this.description = this.group.description;
    this.users = this.group.members;
    this.expirationDate = this.group.expirationDate;
  }

  private isValidInput(): boolean {
    const potentialErrorMessage = this.validateInput();
    if (potentialErrorMessage !== '') {
      this.alertService.addNotification(new Notification(NotificationType.ERROR, potentialErrorMessage));
      return false;
    }
    return true;
  }

  private validateInput(): string {
    let errorMessage = '';
    if (!this.name || this.name.replace(/\s/g, '') === '') {
      errorMessage += 'Name cannot be empty\n';
    }
    if (!this.description || this.description.replace(/\s/g, '') === '') {
      errorMessage += 'Description cannot be empty\n';
    }
    return errorMessage;
  }

  private setValuesToGroupObject(): Group {
    const editedGroup = new Group();
    if (this.editMode) {
      editedGroup.id = this.group.id;
    }
    editedGroup.name = this.name;
    editedGroup.description = this.description;
    editedGroup.members = this.users;
    editedGroup.expirationDate = this.expirationDate;
    return editedGroup;
  }

  private sendSaveRequest(group: Group) {
    if (this.editMode) {
      this.sendUpdateRequest(group);
    } else {
      this.sendCreateRequest(group);
    }
  }

  private sendUpdateRequest(group: Group) {
    this.groupFacade.updateGroup(group)
      .subscribe(
        resp => this.dialogRef.close(DialogResultEnum.SUCCESS),
        err => this.errorHandler.displayInAlert(err, 'Updating group')
  );
  }

  private sendCreateRequest(group: Group) {
    const groupIdsToImportUsers = this.groups.map(groupToBeImported => groupToBeImported.id);
    this.groupFacade.createGroup(group, groupIdsToImportUsers)
      .subscribe(
        resp => this.dialogRef.close(DialogResultEnum.SUCCESS),
        err => this.errorHandler.displayInAlert(err, 'Creating group')

  );
  }
}
