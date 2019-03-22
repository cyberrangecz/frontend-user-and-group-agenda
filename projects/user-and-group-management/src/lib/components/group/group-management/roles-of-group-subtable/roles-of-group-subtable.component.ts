import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Group} from '../../../../model/group/group.model';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Role} from '../../../../model/role/role.model';
import {GroupFacadeService} from '../../../../services/group/group-facade.service';
import {AlertService} from '../../../../services/alert/alert.service';
import {Alert} from '../../../../model/alert/alert.model';
import {AlertType} from '../../../../model/enums/alert-type.enum';

@Component({
  selector: 'kypo2-roles-of-group-subtable',
  templateUrl: './roles-of-group-subtable.component.html',
  styleUrls: ['./roles-of-group-subtable.component.css']
})
export class RolesOfGroupSubtableComponent implements OnInit {

  @Input() group: Group;

  displayedColumns = ['name', 'microservice', 'remove'];
  dataSource: MatTableDataSource<Role>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private groupFacade: GroupFacadeService,
              private alertService: AlertService) { }

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
    this.groupFacade.removeRoleFromGroup(this.group.id, role.id)
      .subscribe(
        resp => {
          this.deleteRemovedRoleFromTable(role);
          this.alertService.addAlert(new Alert(AlertType.SUCCESS, 'Role was successfully removed'));
        },
        err => {
          this.alertService.addAlert(new Alert(AlertType.ERROR, 'Role was not removed'), err);
        }
      );
  }

  private deleteRemovedRoleFromTable(removedRole: Role) {
    this.group.roles = this.group.roles.filter(role =>
      !(role.id === removedRole.id));
    this.createDataSource();
  }
}
