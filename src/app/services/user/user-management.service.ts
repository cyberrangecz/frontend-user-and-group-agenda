import {Injectable} from '@angular/core';
import {Set} from 'typescript-collections';
import {User} from '../../model/user/user.model';
import {Observable, Subject} from 'rxjs';
import {UserFacadeService} from './user-facade.service';

@Injectable()
export class UserManagementService {

  constructor(private userFacade: UserFacadeService) {

  }

  private _selectedUsers: Set<User> = new Set<User>();

  private selectionChangeSubject: Subject<number> = new Subject<number>();
  selectionChange$: Observable<number> = this.selectionChangeSubject.asObservable();

  selectUser(user: User) {
    this._selectedUsers.add(user);
    this.emitSelectionChange();
  }

  selectUsers(users: User[]) {
    const selectedUsers = new Set<User>();
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

  synchronizeSelectedUsers() {
    // TODO
  }

  deleteSelectedUsers() {
    return this.userFacade.deleteUsers(this._selectedUsers.toArray()
      .map(user => user.id));
  }

  createUser(user: User) {
    // TODO
  }

  private emitSelectionChange() {
    this.selectionChangeSubject.next(this._selectedUsers.size());
  }


}
