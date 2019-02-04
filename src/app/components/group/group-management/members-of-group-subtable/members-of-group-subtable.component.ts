import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Group} from '../../../../model/group/group.model';
import {MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {User} from '../../../../model/user/user.model';
import {SelectionModel} from '@angular/cdk/collections';
import {AlertService} from '../../../../services/alert/alert.service';
import {Alert} from '../../../../model/alert/alert.model';
import {AlertType} from '../../../../model/enums/alert-type.enum';
import {GroupFacadeService} from '../../../../services/group/group-facade.service';
import {Set} from 'typescript-collections';

@Component({
  selector: 'app-members-of-group-subtable',
  templateUrl: './members-of-group-subtable.component.html',
  styleUrls: ['./members-of-group-subtable.component.css']
})
export class MembersOfGroupSubtableComponent implements OnInit {

  @Input() group: Group;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['select', 'name', 'login', 'remove'];
  dataSource: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);

  selectedUsersCount = 0;
  totalUsersCount = 0;
  selectedUsers: Set<User> = new Set<User>(user => user.login);

  constructor(public dialog: MatDialog,
              private groupFacade: GroupFacadeService,
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

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  selectAllChange() {
    if (this.isAllSelected()) {
      this.unselectAll();
    } else {
      this.selectAll();
    }
  }

  selectChange(event: MatCheckboxChange, user: User) {
    if (event.checked) {
      this.selectUser(user);
    } else {
      this.unselectUser(user);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  removeUserFromGroup(userToRemove: User) {
    this.groupFacade.removeUsersFromGroup(this.group.id, [userToRemove.id])
      .subscribe(
        resp => {
          this.alertService.addAlert(new Alert(AlertType.SUCCESS, 'User was successfully deleted'));
          this.unselectUser(userToRemove);
          this.group.members.splice(this.group.members.findIndex(user => user.id === userToRemove.id));
          this.createDataSource();
        },
        err => this.alertService.addAlert(new Alert(AlertType.ERROR, 'User was not deleted'), {error: err}));
  }

  removeSelectedUsersFromGroup() {
    const idsToRemove = this.selectedUsers.toArray().map(user => user.id);
    this.groupFacade.removeUsersFromGroup(this.group.id, idsToRemove)
      .subscribe(
        resp => {
          this.alertService.addAlert(new Alert(AlertType.SUCCESS, 'Users were successfully deleted'));
          const indexes = idsToRemove.map(id => this.group.members.findIndex(user => idsToRemove.includes(user.id)));
          indexes.forEach(index => this.group.members.splice(index))
          this.unselectAll();
          this.createDataSource();
        },
        err => this.alertService.addAlert(new Alert(AlertType.ERROR, 'Users were not deleted'), {error: err}));
  }

  private unselectAll() {
    this.selectedUsersCount = 0;
    this.selection.clear();
    this.selectedUsers.clear();
  }

  private selectAll() {
    this.selectedUsersCount = this.totalUsersCount;
    this.dataSource.data.forEach(row => {
      this.selection.select(row);
      this.selectedUsers.add(row);
    });
  }

  private selectUser(user: User) {
    this.selectedUsers.add(user);
    this.selectedUsersCount = this.selectedUsers.size();
  }

  private unselectUser(user: User) {
    this.selectedUsers.remove(user);
    this.selectedUsersCount = this.selectedUsers.size();

  }

  private createDataSource() {
    this.dataSource = new MatTableDataSource(this.group.members);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
