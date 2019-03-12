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
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogInputModel} from '../../../shared/confirmation-dialog/confirmation-dialog-input.model';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';

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

  constructor(private dialog: MatDialog,
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
    this.userConfirmedRemovingUserFromGroup(userToRemove)
      .subscribe(confirmed => {
        if (confirmed) {
          this.requestRemoveUserFromGroup(userToRemove);
        }
      });
  }

  removeSelectedUsersFromGroup() {
    this.userConfirmedRemovingUsersFromGroup(this.selectedUsers)
      .subscribe(confirmed => {
        if (confirmed) {
          this.requestRemoveSelectedUsersFromGroup();
        }
      });
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
    this.selection.select(user);
    this.selectedUsersCount = this.selectedUsers.size();
  }

  private unselectUser(user: User) {
    this.selectedUsers.remove(user);
    this.selection.deselect(user);
    this.selectedUsersCount = this.selectedUsers.size();

  }

  private createDataSource() {
    this.dataSource = new MatTableDataSource(this.group.members);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.totalUsersCount = this.dataSource.data.length;
  }

  private removeDeletedUsersFromTable(removedIds: number[]) {
    this.group.members = this.group.members.filter(user => !removedIds.includes(user.id));
    this.createDataSource();
  }

  private userConfirmedRemovingUserFromGroup(userToRemove: User): Observable<boolean> {
    const dialogData = new ConfirmationDialogInputModel();
    dialogData.title = 'Remove user from group';
    dialogData.content = `Do you want to remove ${userToRemove.name} from group ${this.group.name}?`;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: dialogData });
    return dialogRef.afterClosed()
      .pipe(map(result => result === DialogResultEnum.SUCCESS));
  }

  private userConfirmedRemovingUsersFromGroup(usersToRemove: Set<User>): Observable<boolean> {
    const dialogData = new ConfirmationDialogInputModel();
    dialogData.title = 'Remove users from group';
    dialogData.content = `Do you want to remove ${usersToRemove.size()} selected users from group ${this.group.name}?`;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: dialogData });
    return dialogRef.afterClosed()
      .pipe(map(result => result === DialogResultEnum.SUCCESS));
  }

  private requestRemoveUserFromGroup(userToRemove: User) {
    this.groupFacade.removeUsersFromGroup(this.group.id, [userToRemove.id])
      .subscribe(
        resp => {
          this.alertService.addAlert(new Alert(AlertType.SUCCESS, 'User was successfully deleted'));
          this.unselectUser(userToRemove);
          this.removeDeletedUsersFromTable([userToRemove.id]);
        },
        err => this.alertService.addAlert(new Alert(AlertType.ERROR, 'User was not deleted'), {error: err}));
  }

  private requestRemoveSelectedUsersFromGroup() {
    const idsToRemove = this.selectedUsers.toArray().map(user => user.id);
    this.groupFacade.removeUsersFromGroup(this.group.id, idsToRemove)
      .subscribe(
        resp => {
          this.alertService.addAlert(new Alert(AlertType.SUCCESS, 'Users were successfully deleted'));
          this.removeDeletedUsersFromTable(idsToRemove);
          this.unselectAll();
        },
        err => this.alertService.addAlert(new Alert(AlertType.ERROR, 'Users were not deleted'), {error: err}));
  }
}
