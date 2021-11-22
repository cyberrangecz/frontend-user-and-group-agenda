import { Component, Input } from '@angular/core';
import { UserRole } from '@muni-kypo-crp/user-and-group-model';

@Component({
  selector: 'kypo-role-expand',
  templateUrl: './role-expand.component.html',
  styleUrls: ['./role-expand.component.css'],
})
export class RoleExpandComponent {
  @Input() data: UserRole;
}
