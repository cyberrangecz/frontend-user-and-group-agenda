import {Injectable} from '@angular/core';
import {Set} from 'typescript-collections';
import {Group} from '../../../model/group/group.model';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class GroupSelectionService {

  private _selectedGroups: Set<Group> = new Set<Group>(group => group.id.toString());

  private _selectionChangeSubject: Subject<number> = new Subject<number>();
  selectionChange$: Observable<number> = this._selectionChangeSubject.asObservable();

  private _dataChangeSubject: Subject<any> = new Subject<any>();
  dataChange$: Observable<any> = this._dataChangeSubject.asObservable();

  selectGroup(group: Group) {
    this._selectedGroups.add(group);
    this.emitSelectionChange();
  }

  selectGroups(groups: Group[]) {
    const selectedGroups = new Set<Group>(group => group.id.toString());
    groups.forEach(group => selectedGroups.add(group));
    this._selectedGroups.union(selectedGroups);
    this.emitSelectionChange();
  }

  unselectGroup(unselectedGroup: Group) {
    this._selectedGroups.remove(unselectedGroup);
    this.emitSelectionChange();
  }

  unselectAllGroups() {
    this._selectedGroups.clear();
    this.emitSelectionChange();
  }

  getSelectedGroups(): Group[] {
    return this._selectedGroups.toArray();
  }

  emitDataChange() {
    this._dataChangeSubject.next();
  }

  private emitSelectionChange() {
    this._selectionChangeSubject.next(this._selectedGroups.size());
  }
}
