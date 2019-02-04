import {Component, Input, OnInit} from '@angular/core';
import {Group} from '../../../../model/group/group.model';

@Component({
  selector: 'app-members-of-group-subtable',
  templateUrl: './members-of-group-subtable.component.html',
  styleUrls: ['./members-of-group-subtable.component.css']
})
export class MembersOfGroupSubtableComponent implements OnInit {

  @Input() group: Group;

  constructor() { }

  ngOnInit() {
  }

}
