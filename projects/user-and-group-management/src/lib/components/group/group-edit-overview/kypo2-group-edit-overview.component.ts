import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Group} from '../../../model/group/group.model';
import {defer, Observable, of} from 'rxjs';
import {Kypo2GroupEditService} from '../../../services/group/kypo2-group-edit.service';
import {GroupChangedEvent} from '../../../model/events/group-changed-event';
import {take, takeWhile, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../model/base-component';
import {ActivatedRoute} from '@angular/router';
import {KypoControlItem} from 'kypo-controls';
import {SaveControlItem} from '../../../model/controls/save-control-item';

@Component({
  selector: 'kypo2-group-edit-overview',
  templateUrl: './kypo2-group-edit-overview.component.html',
  styleUrls: ['./kypo2-group-edit-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Kypo2GroupEditOverviewComponent extends BaseComponent implements OnInit {

  @Output() canDeactivateEvent: EventEmitter<boolean> = new EventEmitter();

  group$: Observable<Group>;
  editMode$: Observable<boolean>;
  canDeactivateGroupEdit = true;
  canDeactivateMembers = true;
  canDeactivateRoles = true;
  controls: KypoControlItem[];

  constructor(
    private activeRoute: ActivatedRoute,
    private editService: Kypo2GroupEditService) {
    super();
    this.group$ = this.editService.group$;
    this.editMode$ = this.editService.editMode$
      .pipe(
        tap(editMode => this.initControls(editMode))
      );
    this.activeRoute.data
      .pipe(
        takeWhile(_ => this.isAlive),
      ).subscribe(data => this.editService.set(data.group));
  }

  ngOnInit() {
  }

  /**
   * Determines if all changes in sub components are saved and user can navigate to different component
   */
  canDeactivate(): boolean {
    return this.canDeactivateGroupEdit && this.canDeactivateMembers && this.canDeactivateRoles;
  }

  onControlAction(controlItem: KypoControlItem) {
    controlItem.result$
      .pipe(
        take(1)
      ).subscribe();
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
      defer(() => this.editService.save()
        .pipe(
          tap(_ => this.canDeactivateGroupEdit = true)
        )
      ));
    if (isEditMode) {
      this.controls = [saveItem];
    } else {
      saveItem.label = 'Create';
      const saveAndStayItem = new SaveControlItem('Create and continue editing',
        this.editService.saveDisabled$,
        defer(() => this.editService.createAndEdit()
          .pipe(
            tap(_ => this.canDeactivateGroupEdit = true)
          )
        ));
      saveAndStayItem.id = 'save_and_stay';
      this.controls = [
        saveItem,
        saveAndStayItem
      ];
    }
  }
}
