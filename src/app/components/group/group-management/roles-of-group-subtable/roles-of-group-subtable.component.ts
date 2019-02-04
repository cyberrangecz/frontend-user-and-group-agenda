import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Group} from '../../../../model/group/group.model';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Role} from '../../../../model/role.model';

@Component({
  selector: 'app-roles-of-group-subtable',
  templateUrl: './roles-of-group-subtable.component.html',
  styleUrls: ['./roles-of-group-subtable.component.css']
})
export class RolesOfGroupSubtableComponent implements OnInit {

  @Input() group: Group;

  displayedColumns = ['name', 'microservice', 'remove'];
  dataSource: MatTableDataSource<Role>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.createDataSource();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private createDataSource() {
    this.dataSource = new MatTableDataSource(this.group.roles);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  removeRole(role: Role) {
    // TODO
  }
}
