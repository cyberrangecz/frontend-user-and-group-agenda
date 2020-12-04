import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { User } from '@muni-kypo-crp/user-and-group-model';

/**
 * User detail component displayed in expanded row of a table component.
 */
@Component({
  selector: 'kypo-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent implements OnInit {
  @HostBinding('style.width') width = '100%';
  @Input() data: User;

  ngOnInit(): void {}
}
