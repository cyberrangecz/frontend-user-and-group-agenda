import {Injectable} from '@angular/core';
import {User} from '../../model/user/user.model';
import {Observable, Subject} from 'rxjs';
import {UserFacadeService} from './user-facade.service';

@Injectable()
export class UserManagementService {

  constructor(private userFacade: UserFacadeService) {

  }

  private _selectedUsers: User[] = [];

  private selectionChangeSubject: Subject<User[]> = new Subject<User[]>();
  selectionChange$: Observable<User[]> = this.selectionChangeSubject.asObservable();

  selectUser(user: User) {
    this._selectedUsers.push(user);
    this.emitSelectionChange();
  }

  unselectUser(unselectedUser: User) {
    const index = this._selectedUsers.findIndex(user => user.login === unselectedUser.login);
    if (index !== -1) {
      this._selectedUsers.splice(index, 1);
      this.emitSelectionChange();
    }
  }

  unselectAllUsers() {
    this._selectedUsers = [];
    this.emitSelectionChange();
  }

  getSelectedUsers(): User[] {
    return this._selectedUsers;
  }

  synchronizeSelectedUsers() {
    // TODO
  }

  deleteSelectedUsers() {
    return this.userFacade.deleteUsers(this._selectedUsers.map(user => user.id));
  }

  createUser(user: User) {
    // TODO
  }

  private emitSelectionChange() {
    this.selectionChangeSubject.next(this._selectedUsers);
  }


}
