import { Component, OnInit } from '@angular/core';
import {UserManagementService} from '../../../../services/user/user-management.service';

@Component({
  selector: 'app-user-controls',
  templateUrl: './user-controls.component.html',
  styleUrls: ['./user-controls.component.css']
})
export class UserControlsComponent implements OnInit {
  selectedUsersCount: number;

  constructor(private userManagementService: UserManagementService) {
  }

  ngOnInit() {
  }

  addAccount() {

  }

  deleteAccounts() {

  }

  synchronizeAccounts() {

  }
}
