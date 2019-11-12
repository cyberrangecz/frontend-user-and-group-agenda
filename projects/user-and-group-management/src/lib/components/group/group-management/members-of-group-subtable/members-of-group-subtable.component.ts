import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Group} from '../../../../model/group/group.model';
import {MatCheckboxChange, MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Kypo2UserAndGroupNotificationService} from '../../../../services/notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupNotification} from '../../../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../../../model/enums/alert-type.enum';
import {GroupFacadeService} from '../../../../services/facade/group/group-facade.service';
import {Set} from 'typescript-collections';
import {ConfirmationDialogComponent} from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import {ConfirmationDialogInputModel} from '../../../shared/confirmation-dialog/confirmation-dialog-input.model';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {DialogResultEnum} from '../../../../model/enums/dialog-result.enum';
import {Kypo2UserAndGroupErrorService} from '../../../../services/notification/kypo2-user-and-group-error.service';
import {User} from 'kypo2-auth';
import {StringNormalizer} from '../../../../model/utils/string-normalizer';
import {UserTableRow} from '../../../../model/table-adapters/user-table-row';
import {Kypo2UserAndGroupError} from '../../../../model/events/kypo2-user-and-group-error';

@Component({
  selector: 'kypo2-members-of-group-subtable',
  templateUrl: './members-of-group-subtable.component.html',
  styleUrls: ['./members-of-group-subtable.component.css']
})
export class MembersOfGroupSubtableComponent implements OnInit, OnDestroy {

  @Input() group: Group;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns = ['select', 'name', 'login', 'issuer', 'remove'];
  dataSource: MatTableDataSource<UserTableRow>;
  selection = new SelectionModel<User>(true, []);

  selectedUsersCount = 0;
  totalUsersCount = 0;
  selectedUsers: Set<User> = new Set<User>(user => user.id.toString());

  private paginationChangeSubscription: Subscription;

  constructor(private dialog: MatDialog,
              private groupFacade: GroupFacadeService,
              private errorHandler: Kypo2UserAndGroupErrorService,
              private alertService: Kypo2UserAndGroupNotificationService) { }

  ngOnInit() {
    this.createDataSource();
  }

  ngOnDestroy(): void {
    if (this.paginationChangeSubscription) {
      this.paginationChangeSubscription.unsubscribe();
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = StringNormalizer.normalizeDiacritics(filterValue.trim().toLowerCase());
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
    return this.selection.selected.length === this.dataSource._pageData(this.dataSource.data).length;
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
    this.dataSource._pageData(this.dataSource.data).forEach(row =>
      this.selectedUsers.remove(row.user));
    this.selection.clear();
    this.selectedUsersCount = this.selectedUsers.size();
  }

  private selectAll() {
    this.dataSource._pageData(this.dataSource.data).forEach(row => {
      this.selection.select(row.user);
      this.selectedUsers.add(row.user);
    });
    this.selectedUsersCount = this.selectedUsers.size();
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
    this.dataSource = new MatTableDataSource(this.group.members.map(user => new UserTableRow(user)));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.totalUsersCount = this.dataSource.data.length;
    this.dataSource.filterPredicate =
      (row: UserTableRow, filter: string) =>
        row.normalizedLogin.indexOf(filter) !== -1
        || row.normalizedName.indexOf(filter) !== -1;
    this.paginationChangeSubscription = this.paginator.page.subscribe(pageChange => {
      this.selection.clear();
      this.markCheckboxes(this.findPreselectedUsers(this.dataSource._pageData(this.dataSource.data).map(row => row.user)));
    });
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
          this.alertService.notify(
            new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS,
              'User was successfully deleted'));
          this.unselectUser(userToRemove);
          this.removeDeletedUsersFromTable([userToRemove.id]);
        },
        err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting user'))
      );
  }

  private requestRemoveSelectedUsersFromGroup() {
    const idsToRemove = this.selectedUsers.toArray().map(user => user.id);
    this.groupFacade.removeUsersFromGroup(this.group.id, idsToRemove)
      .subscribe(
        resp => {
          this.alertService.notify(
            new Kypo2UserAndGroupNotification(Kypo2UserAndGroupNotificationType.SUCCESS,
              'Users were successfully deleted'));
          this.removeDeletedUsersFromTable(idsToRemove);
          this.resetSelection();
        },
        err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Deleting users'))
      );
  }

  private resetSelection() {
    this.selection.clear();
    this.selectedUsers.clear();
    this.totalUsersCount = this.dataSource.data.length;
    this.selectedUsersCount = 0;
  }

  private isInSelection(userToCheck: User): boolean {
    return this.selectedUsers.toArray()
      .map(user => user.login)
      .includes(userToCheck.login);
  }

  private findPreselectedUsers(users: User[]): User[] {
    return users.filter(user => this.isInSelection(user));
  }
  private markCheckboxes(users: User[]) {
    this.selection.select(...users);
  }
}
