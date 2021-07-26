/* eslint-disable @angular-eslint/no-output-native */
/* eslint-disable @angular-eslint/no-output-on-prefix */
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SentinelBaseDirective } from '@sentinel/common';
import { SentinelControlItem } from '@sentinel/components/controls';
import { Group } from '@muni-kypo-crp/user-and-group-model';
import { defer, Observable } from 'rxjs';
import { take, takeWhile, tap } from 'rxjs/operators';
import { GROUP_DATA_ATTRIBUTE_NAME } from '@muni-kypo-crp/user-and-group-agenda';
import { SaveControlItem } from '@muni-kypo-crp/user-and-group-agenda/internal';
import { GroupChangedEvent } from '../model/group-changed-event';
import { GroupEditService } from '../services/state/group-edit.service';
import { GroupEditConcreteService } from '../services/state/group-edit-concrete.service';

@Component({
  selector: 'kypo-group-edit-overview',
  templateUrl: './group-edit-overview.component.html',
  styleUrls: ['./group-edit-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: GroupEditService, useClass: GroupEditConcreteService }],
})
export class GroupEditOverviewComponent extends SentinelBaseDirective {
  @Output() canDeactivateEvent: EventEmitter<boolean> = new EventEmitter();

  group$: Observable<Group>;
  editMode$: Observable<boolean>;
  canDeactivateGroupEdit = true;
  canDeactivateMembers = true;
  canDeactivateRoles = true;
  controls: SentinelControlItem[];

  constructor(private activeRoute: ActivatedRoute, private editService: GroupEditService) {
    super();
    this.group$ = this.editService.group$;
    this.editMode$ = this.editService.editMode$.pipe(tap((editMode) => this.initControls(editMode)));
    this.activeRoute.data
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((data) => this.editService.set(data[GROUP_DATA_ATTRIBUTE_NAME]));
  }

  /**
   * Determines if all changes in sub components are saved and user can navigate to different component
   */
  canDeactivate(): boolean {
    return this.canDeactivateGroupEdit && this.canDeactivateMembers && this.canDeactivateRoles;
  }

  onControlAction(controlItem: SentinelControlItem): void {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  onGroupChanged(groupEvent: GroupChangedEvent): void {
    this.canDeactivateGroupEdit = false;
    this.editService.change(groupEvent);
  }

  onUnsavedMembersChange(hasUnsavedChanges: boolean): void {
    this.canDeactivateMembers = !hasUnsavedChanges;
  }

  onUnsavedRolesChange(hasUnsavedChanges: boolean): void {
    this.canDeactivateRoles = !hasUnsavedChanges;
  }

  private initControls(isEditMode: boolean) {
    const saveItem = new SaveControlItem(
      'Save',
      this.editService.saveDisabled$,
      defer(() => this.editService.save().pipe(tap(() => (this.canDeactivateGroupEdit = true))))
    );
    if (isEditMode) {
      this.controls = [saveItem];
    } else {
      saveItem.label = 'Create';
      const saveAndStayItem = new SaveControlItem(
        'Create and continue editing',
        this.editService.saveDisabled$,
        defer(() => this.editService.createAndEdit().pipe(tap(() => (this.canDeactivateGroupEdit = true))))
      );
      saveAndStayItem.id = 'save_and_stay';
      this.controls = [saveItem, saveAndStayItem];
    }
  }
}
