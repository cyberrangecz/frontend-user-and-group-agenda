import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserManagementService} from '../../../../services/user/user-management.service';
import {Subscription} from 'rxjs';
import {UserFacadeService} from '../../../../services/user/user-facade.service';
import {AlertService} from '../../../../services/alert/alert.service';
import {AlertType} from '../../../../model/enums/alert-type.enum';
import {Alert} from '../../../../model/alert/alert.model';

@Component({
  selector: 'app-user-controls',
  templateUrl: './user-controls.component.html',
  styleUrls: ['./user-controls.component.css']
})
export class UserControlsComponent implements OnInit, OnDestroy {

  private _selectedUsersSubscription: Subscription;
  selectedUsersCount = 0;

  constructor(private userManagementService: UserManagementService,
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

  createAccount() {
    // TODO popup
  }

  deleteUsers() {
    if (this.selectedUsersCount > 0) {
      this.sendDeleteUsersRequest();
    } else {
      this.alertService.addAlert(new Alert(AlertType.INFO, 'Select users first'));
    }
  }

  synchronizeAccounts() {
    // TODO
  }

  private subscribeSelectedUsers() {
    this._selectedUsersSubscription = this.userManagementService.selectionChange$
      .subscribe(size =>
        this.selectedUsersCount = size);
  }

  private getSelectedUserIds(): number[] {
    return this.userManagementService.getSelectedUsers().map(user => user.id);
  }

  private sendDeleteUsersRequest() {
    this.userFacade.deleteUsers(this.getSelectedUserIds())
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
}
