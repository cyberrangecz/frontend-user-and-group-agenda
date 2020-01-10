import {Kypo2GroupEditService} from './kypo2-group-edit.service';
import {GroupChangedEvent} from '../../model/events/group-changed-event';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {Group} from '../../model/group/group.model';
import {ResourceSavedEvent} from '../../model/events/resource-saved-event';
import {GroupApi} from '../api/group/group-api.service';
import {map, tap} from 'rxjs/operators';
import {Kypo2UserAndGroupNotificationService} from '../notification/kypo2-user-and-group-notification.service';
import {Kypo2UserAndGroupErrorService} from '../notification/kypo2-user-and-group-error.service';
import {Kypo2UserAndGroupNotification} from '../../model/events/kypo2-user-and-group-notification';
import {Kypo2UserAndGroupNotificationType} from '../../model/enums/kypo2-user-and-group-notification-type.enum';
import {Kypo2UserAndGroupError} from '../../model/events/kypo2-user-and-group-error';
import {Injectable} from '@angular/core';

/**
 * Basic implementation of a layer between a component and an API service.
 * Handles group editing.
 */
@Injectable()
export class GroupEditConcreteService extends Kypo2GroupEditService {

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

  constructor(private groupFacade: GroupApi,
              private notificationService: Kypo2UserAndGroupNotificationService,
              private errorHandler: Kypo2UserAndGroupErrorService) {
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
  save(): Observable<ResourceSavedEvent> {
    if (this.editModeSubject$.getValue()) {
      const id = this.editedGroup.id;
      return this.update()
        .pipe(map(_ => new ResourceSavedEvent(id, true)));
    } else {
      return this.create()
        .pipe(map(id => new ResourceSavedEvent(id, false)));
    }  }

  private setEditMode(group: Group) {
    this.editModeSubject$.next(group !== null && group !== undefined);
  }

  private update() {
    return this.groupFacade.update(this.editedGroup)
      .pipe(
        tap(
          id => {
            this.notificationService.notify(new Kypo2UserAndGroupNotification(
              Kypo2UserAndGroupNotificationType.SUCCESS,
              'Changes were successfully saved.'));
            this.onSaved();
          },
          err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Editing group'))
        )
      );
  }

  private create(): Observable<number> {
    return this.groupFacade.create(this.editedGroup)
      .pipe(
        tap(
          id => {
            this.notificationService.notify(new Kypo2UserAndGroupNotification(
              Kypo2UserAndGroupNotificationType.SUCCESS,
              'Group was successfully saved.'));
            this.onSaved();
          },
          err => this.errorHandler.emit(new Kypo2UserAndGroupError(err, 'Creating group'))
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
