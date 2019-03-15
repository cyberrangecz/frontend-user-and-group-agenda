import { Component, OnInit } from '@angular/core';
import {Paths} from './components/shared/paths';

@Component({
  selector: 'kypo2-user-and-group-management',
  templateUrl: './user-and-group-management.component.html',
  styleUrls: ['./user-and-group-management.component.css']
})
export class UserAndGroupManagementComponent implements OnInit {

  links: { path: string, label: string }[];

  constructor() { }

  ngOnInit() {
    this.links = [
      {
        path: Paths.USER_PATH,
        label: 'User management'
      },
      {
        path: Paths.GROUP_PATH,
        label: 'Group management'
      }
    ];
  }
}

