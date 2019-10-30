import {Injectable} from '@angular/core';
import {Set} from 'typescript-collections';
import {User} from 'kypo2-auth';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class UserSelectionService {

  private _selectedUsers: Set<User> = new Set<User>(user => user.login);

  private _selectionChangeSubject: Subject<number> = new Subject<number>();
  selectionChange$: Observable<number> = this._selectionChangeSubject.asObservable();

  private _dataChangeSubject: Subject<any> = new Subject<any>();
  dataChange$: Observable<any> = this._dataChangeSubject.asObservable();

  selectUser(user: User) {
    this._selectedUsers.add(user);
    this.emitSelectionChange();
  }

  selectUsers(users: User[]) {
    const selectedUsers = new Set<User>(user => user.login);
    users.forEach(user => selectedUsers.add(user));
    this._selectedUsers.union(selectedUsers);
    this.emitSelectionChange();
  }

  unselectUser(unselectedUser: User) {
    this._selectedUsers.remove(unselectedUser);
    this.emitSelectionChange();
  }

  unselectAllUsers() {
    this._selectedUsers.clear();
    this.emitSelectionChange();
  }

  getSelectedUsers(): User[] {
    return this._selectedUsers.toArray();
  }

  emitDataChange() {
    this._dataChangeSubject.next();
  }

  private emitSelectionChange() {
    this._selectionChangeSubject.next(this._selectedUsers.size());
  }
}
