import { GroupEditFormGroup } from './group-edit-form-group';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Group } from '../../../model/group/group.model';
import { GroupFacadeService } from '../../../services/facade/group/group-facade.service';
import { Kypo2UserAndGroupNotificationService } from '../../../services/notification/kypo2-user-and-group-notification.service';
import { Notification } from '../../../model/alert/alert.model';
import { NotificationType } from '../../../model/enums/alert-type.enum';
import { DialogResultEnum } from '../../../model/enums/dialog-result.enum';
import { ErrorHandlerService } from '../../../services/notification/error-handler.service';
import { User } from 'kypo2-auth';

@Component({
  selector: 'kypo2-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {

  editMode = false;
  tomorrow: Date;
  users: User[] = [];
  groups: Group[] = [];

  groupEditFormGroup: GroupEditFormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public group: Group,
    public dialogRef: MatDialogRef<GroupEditComponent>,
    private groupFacade: GroupFacadeService,
    private errorHandler: ErrorHandlerService,
    private alertService: Kypo2UserAndGroupNotificationService) {
  }

  ngOnInit() {
    this.groupEditFormGroup = new GroupEditFormGroup();
    const today = new Date();
    this.tomorrow = new Date(new Date(today.setDate(today.getDate() + 1)).setHours(0, 0, 0));
    if (this.group) {
      this.resolveInitialValues();
    }
  }


  get name() { return this.groupEditFormGroup.formGroup.get('name'); }
  get description() { return this.groupEditFormGroup.formGroup.get('description'); }
  get expirationDate() { return this.groupEditFormGroup.formGroup.get('expirationDate'); }

  cancel() {
    this.dialogRef.close(DialogResultEnum.CANCELED);
  }

  save() {
    if (this.groupEditFormGroup.formGroup.valid) {
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
    this.name.setValue(this.group.name);
    this.description.setValue(this.group.description);
    this.users = this.group.members;
    this.expirationDate.setValue(this.group.expirationDate);
  }

  private setValuesToGroupObject(): Group {
    const editedGroup = new Group();
    if (this.editMode) {
      editedGroup.id = this.group.id;
    }
    editedGroup.name = this.name.value;
    editedGroup.description = this.description.value;
    editedGroup.members = this.users;
    editedGroup.expirationDate = this.expirationDate.value;
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
