import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GroupChangedEvent } from '../../model/events/group-changed-event';
import { Group } from '../../model/group/group.model';
import { GroupApi } from '../api/group/group-api.service';
import { UserAndGroupErrorHandler } from '../client/user-and-group-error-handler.service';
import { UserAndGroupNavigator } from '../client/user-and-group-navigator.service';
import { UserAndGroupNotificationService } from '../client/user-and-group-notification.service';
import { GroupEditService } from './group-edit.service';

/**
 * Basic implementation of a layer between a component and an API service.
 * Handles group editing.
 */
@Injectable()
export class GroupEditConcreteService extends GroupEditService {
  private editModeSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * True if existing group is edited, false if new one is created
   */
  editMode$: Observable<boolean> = this.editModeSubject$.asObservable();

  private groupSubject$: ReplaySubject<Group> = new ReplaySubject();

  /**
   * Edited group
   */
  group$: Observable<Group> = this.groupSubject$.asObservable();

  private saveDisabledSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * True if saving is disabled (for example invalid data), false otherwise
   */
  saveDisabled$: Observable<boolean> = this.saveDisabledSubject$.asObservable();

  private editedGroup: Group;

  constructor(
    private api: GroupApi,
    private notificationService: UserAndGroupNotificationService,
    private router: Router,
    private navigator: UserAndGroupNavigator,
    private errorHandler: UserAndGroupErrorHandler
  ) {
    super();
  }

  /**
   * Sets group to edit
   * @param initialGroup group to edit
   */
  set(initialGroup: Group) {
    let group = initialGroup;
    this.setEditMode(group);
    if (group === null || group === undefined) {
      group = new Group();
    }
    this.groupSubject$.next(group);
  }

  /**
   * Handles group edit changes. Updates internal state and emits observables
   * @param changeEvent edited group change event
   */
  change(changeEvent: GroupChangedEvent) {
    this.saveDisabledSubject$.next(!changeEvent.isValid);
    this.editedGroup = changeEvent.group;
  }

  /**
   * Saves edited group, updated related observables or handles error
   */
  save(): Observable<any> {
    return this.editModeSubject$.getValue()
      ? this.update()
      : this.create().pipe(tap((_) => this.router.navigate([this.navigator.toGroupOverview()])));
  }

  createAndEdit(): Observable<any> {
    return this.create().pipe(tap((id) => this.router.navigate([this.navigator.toGroupEdit(id)])));
  }

  private setEditMode(group: Group) {
    this.editModeSubject$.next(group !== null && group !== undefined);
  }

  private update() {
    return this.api.update(this.editedGroup).pipe(
      tap(
        (id) => {
          this.notificationService.emit('success', 'Group was saved');
          this.onSaved();
        },
        (err) => this.errorHandler.emit(err, 'Editing group')
      )
    );
  }

  private create(): Observable<number> {
    return this.api.create(this.editedGroup).pipe(
      tap(
        (id) => {
          this.notificationService.emit('success', 'Group was created');
          this.onSaved();
        },
        (err) => this.errorHandler.emit(err, 'Creating group')
      )
    );
  }

  private onSaved() {
    this.editModeSubject$.next(true);
    this.saveDisabledSubject$.next(true);
    this.groupSubject$.next(this.editedGroup);
    this.editedGroup = null;
  }
}
