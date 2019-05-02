import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {Role} from '../../../../../model/role/role.model';

@Component({
  selector: 'kypo2-user-roles-dialog',
  templateUrl: './user-roles-dialog.component.html',
  styleUrls: ['./user-roles-dialog.component.css']
})
export class UserRolesDialogComponent implements OnInit {

  displayedColumns = ['name', 'microservice'];
  dataSource: MatTableDataSource<Role>;

  constructor(public dialogRef: MatDialogRef<UserRolesDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
    this.createDataSource();
  }

  private createDataSource() {
    this.dataSource = new MatTableDataSource(this.data.user.roles);
  }

}
