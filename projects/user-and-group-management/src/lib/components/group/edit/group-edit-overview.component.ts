import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KypoBaseComponent } from 'kypo-common';
import { KypoControlItem } from 'kypo-controls';
import { Group } from 'kypo-user-and-group-model';
import { defer, Observable } from 'rxjs';
import { take, takeWhile, tap } from 'rxjs/operators';
import { GROUP_DATA_ATTRIBUTE_NAME } from '../../../model/client/activated-route-data-attributes';
import { SaveControlItem } from '../../../model/controls/save-control-item';
import { GroupChangedEvent } from '../../../model/events/group-changed-event';
import { GroupEditService } from '../../../services/group/group-edit.service';

@Component({
  selector: 'kypo2-group-edit-overview',
  templateUrl: './group-edit-overview.component.html',
  styleUrls: ['./group-edit-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupEditOverviewComponent extends KypoBaseComponent implements OnInit {
  @Output() canDeactivateEvent: EventEmitter<boolean> = new EventEmitter();

  group$: Observable<Group>;
  editMode$: Observable<boolean>;
  canDeactivateGroupEdit = true;
  canDeactivateMembers = true;
  canDeactivateRoles = true;
  controls: KypoControlItem[];

  constructor(private activeRoute: ActivatedRoute, private editService: GroupEditService) {
    super();
    this.group$ = this.editService.group$;
    this.editMode$ = this.editService.editMode$.pipe(tap((editMode) => this.initControls(editMode)));
    this.activeRoute.data
      .pipe(takeWhile((_) => this.isAlive))
      .subscribe((data) => this.editService.set(data[GROUP_DATA_ATTRIBUTE_NAME]));
  }

  ngOnInit() {}

  /**
   * Determines if all changes in sub components are saved and user can navigate to different component
   */
  canDeactivate(): boolean {
    return this.canDeactivateGroupEdit && this.canDeactivateMembers && this.canDeactivateRoles;
  }

  onControlAction(controlItem: KypoControlItem) {
    controlItem.result$.pipe(take(1)).subscribe();
  }

  onGroupChanged(groupEvent: GroupChangedEvent) {
    this.canDeactivateGroupEdit = false;
    this.editService.change(groupEvent);
  }

  onUnsavedMembersChange(hasUnsavedChanges: boolean) {
    this.canDeactivateMembers = !hasUnsavedChanges;
  }

  onUnsavedRolesChange(hasUnsavedChanges: boolean) {
    this.canDeactivateRoles = !hasUnsavedChanges;
  }

  private initControls(isEditMode: boolean) {
    const saveItem = new SaveControlItem(
      'Save',
      this.editService.saveDisabled$,
      defer(() => this.editService.save().pipe(tap((_) => (this.canDeactivateGroupEdit = true))))
    );
    if (isEditMode) {
      this.controls = [saveItem];
    } else {
      saveItem.label = 'Create';
      const saveAndStayItem = new SaveControlItem(
        'Create and continue editing',
        this.editService.saveDisabled$,
        defer(() => this.editService.createAndEdit().pipe(tap((_) => (this.canDeactivateGroupEdit = true))))
      );
      saveAndStayItem.id = 'save_and_stay';
      this.controls = [saveItem, saveAndStayItem];
    }
  }
}
