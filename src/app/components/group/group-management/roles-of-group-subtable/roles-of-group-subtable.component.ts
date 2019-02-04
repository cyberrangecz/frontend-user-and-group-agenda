import {Component, Input, OnInit} from '@angular/core';
import {Group} from '../../../../model/group/group.model';

@Component({
  selector: 'app-roles-of-group-subtable',
  templateUrl: './roles-of-group-subtable.component.html',
  styleUrls: ['./roles-of-group-subtable.component.css']
})
export class RolesOfGroupSubtableComponent implements OnInit {

  @Input() group: Group;

  constructor() { }

  ngOnInit() {
  }

}
