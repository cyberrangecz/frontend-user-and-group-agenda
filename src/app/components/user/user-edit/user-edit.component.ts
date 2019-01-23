import {Component, Inject, OnInit} from '@angular/core';
import {User} from '../../../model/user/user.model';
import {UserFacadeService} from '../../../services/user/user-facade.service';
import {AlertService} from '../../../services/alert/alert.service';
import {Alert} from '../../../model/alert/alert.model';
import {AlertType} from '../../../model/enums/alert-type.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogResultEnum} from '../../../model/enums/dialog-result.enum';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  editMode = false;

  name: string;
  login: string;
  mail: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    public dialogRef: MatDialogRef<UserEditComponent>,
    private userFacade: UserFacadeService,
    private alertService: AlertService) { }

  ngOnInit() {
    if (this.user) {
      this.resolveInitialValues();
    }
  }

  private resolveInitialValues() {
    if (this.user) {
      this.editMode = true;
      this.setValuesFromUser();
    }
  }

  private setValuesFromUser() {
    this.name = this.user.name;
    this.login = this.user.login;
    this.mail = this.user.mail;
  }

  cancel() {
    this.dialogRef.close(DialogResultEnum.CANCELED);
  }

  save() {
    if (this.isValidInput()) {
      const editedUser = this.setValuesToUserObject();
      this.sendSaveRequest(editedUser);
    }
  }

  private isValidInput(): boolean {
    const potentialErrorMessage = this.validateInput();
    if (potentialErrorMessage !== '') {
      this.alertService.addAlert(new Alert(AlertType.ERROR, potentialErrorMessage));
      return false;
    }
    return true;
  }

  private validateInput(): string {
    let errorMessage = '';
    if (!this.name || this.name.replace(/\s/g, '') === '') {
      errorMessage += 'Name cannot be empty\n';
    }
    if (!this.login || this.login.replace(/\s/g, '') === '') {
      errorMessage += 'Login cannot be empty\n';
    }
    if (!this.mail || this.mail.replace(/\s/g, '') === '') {
      errorMessage += 'Email cannot be empty\n';
    } else if (!(this.mail.includes('@')) || !(this.mail.includes('.'))) {
      errorMessage += 'Provide valid email address\n';
    }
    return errorMessage;
  }

  private setValuesToUserObject(): User {
    const editedUser: User = new User();
    editedUser.id = this.user.id;
    editedUser.name = this.name;
    editedUser.mail = this.mail;
    editedUser.login = this.login;
    return editedUser;
  }

  private sendSaveRequest(user: User) {
    if (this.editMode) {
      this.sendUpdateRequest(user);
    } else {
      this.sendCreateRequest(user);
    }
  }

  private sendUpdateRequest(user: User) {
  }

  private sendCreateRequest(user: User) {

  }
}

