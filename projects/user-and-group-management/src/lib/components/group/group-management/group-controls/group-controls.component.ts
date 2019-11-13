import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material';
import {Kypo2UserAndGroupRoutingEventService} from '../../../../services/routing/kypo2-user-and-group-routing-event.service';

@Component({
  selector: 'kypo2-group-controls',
  templateUrl: './group-controls.component.html',
  styleUrls: ['./group-controls.component.css']
})
export class GroupControlsComponent implements OnInit {

  @Input() selectedGroups: number;
  @Output() createNewGroup = new EventEmitter();
  @Output() deleteSelected = new EventEmitter();

  constructor(public dialog: MatDialog,
              private routingService: Kypo2UserAndGroupRoutingEventService) {
  }

  ngOnInit(): void {
  }

  createGroup() {
    this.routingService.navigate(
      {
        resourceType: 'GROUP',
        actionType: 'NEW'
      }
    );
  }

  deleteGroups() {
    this.deleteSelected.emit();
  }
}
