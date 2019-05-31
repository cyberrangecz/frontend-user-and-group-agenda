import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {Role} from '../../../../../model/role/role.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {GroupTableDataModel} from '../../../../../model/table-data/group-table-data.model';

@Component({
  selector: 'kypo2-user-roles-dialog',
  templateUrl: './user-roles-dialog.component.html',
  styleUrls: ['./user-roles-dialog.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UserRolesDialogComponent implements OnInit {

  displayedColumns = ['name', 'microservice'];
  expandedRow: Role;
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
