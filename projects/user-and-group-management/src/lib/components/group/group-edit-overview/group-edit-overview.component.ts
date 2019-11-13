import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Group} from '../../../model/group/group.model';
import {Observable, of} from 'rxjs';
import {GroupEditService} from '../../../services/group/group-edit.service';
import {GroupChangedEvent} from '../../../model/events/group-changed-event';
import {map, takeWhile} from 'rxjs/operators';
import {BaseComponent} from '../../../model/base-component';
import {ActivatedRoute} from '@angular/router';
import {ResourceSavedEvent} from '../../../model/events/resource-saved-event';
import {Kypo2UserAndGroupRoutingEventService} from '../../../services/routing/kypo2-user-and-group-routing-event.service';
import {ConfirmationDialogInput} from '../../shared/confirmation-dialog/confirmation-dialog.input';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {DialogResultEnum} from '../../../model/enums/dialog-result.enum';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'kypo2-group-edit-overview',
  templateUrl: './group-edit-overview.component.html',
  styleUrls: ['./group-edit-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupEditOverviewComponent extends BaseComponent implements OnInit {

  group$: Observable<Group>;
  editMode$: Observable<boolean>;
  saveDisabled$: Observable<boolean>;
  canDeactivateGroupEdit = true;
  canDeactivateMembers = true;
  canDeactivateRoles = true;

  constructor(
    public dialog: MatDialog,
    private routingService: Kypo2UserAndGroupRoutingEventService,
    private activeRoute: ActivatedRoute,
    private editService: GroupEditService) {
    super();
    this.group$ = this.editService.group$;
    this.editMode$ = this.editService.editMode$;
    this.saveDisabled$ = this.editService.saveDisabled$;
    this.activeRoute.data
      .pipe(
        takeWhile(_ => this.isAlive),
      ).subscribe(data => this.editService.set(data.group));
  }

  ngOnInit() {
  }

  /**
   * Determines if all changes in sub components are saved and user can navigate to different component
   * @returns {Observable<boolean>} true if saved all his changes or agreed with leaving without saving them, false otherwise
   */
  canDeactivate(): Observable<boolean> {
    if (!this.canDeactivateGroupEdit || !this.canDeactivateMembers || !this.canDeactivateRoles) {
      const dialogData = new ConfirmationDialogInput();
      dialogData.title = 'Unsaved changes';
      dialogData.content = `Do you want to leave without saving?`;

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {data: dialogData});
      return dialogRef.afterClosed()
        .pipe(map(result => result === DialogResultEnum.SUCCESS));
    } else {
      return of(true);
    }
  }

  save() {
      this.editService.save()
        .pipe(takeWhile(_ => this.isAlive))
        .subscribe(event => this.onGroupSaved(event));
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

  private onGroupSaved(event: ResourceSavedEvent) {
    this.canDeactivateGroupEdit = true;
    if (event.editMode) {
      return;
    } else {
      this.routingService.navigate({ resourceType: 'GROUP', resourceId: event.id, actionType: 'EDIT'});
    }
  }
}
