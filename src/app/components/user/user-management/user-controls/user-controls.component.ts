import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserManagementService} from '../../../../services/user/user-management.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-controls',
  templateUrl: './user-controls.component.html',
  styleUrls: ['./user-controls.component.css']
})
export class UserControlsComponent implements OnInit, OnDestroy {

  private _selectedUsersSubscription: Subscription;
  selectedUsersCount = 0;

  constructor(private userManagementService: UserManagementService) {
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
    this.userManagementService.createUser(null);
  }

  deleteAccounts() {
    this.userManagementService.deleteSelectedUsers();
  }

  synchronizeAccounts() {
    this.userManagementService.synchronizeSelectedUsers();
  }

  private subscribeSelectedUsers() {
    this._selectedUsersSubscription = this.userManagementService.selectionChange$
      .subscribe(users =>
        this.selectedUsersCount = users.length);
  }
}
