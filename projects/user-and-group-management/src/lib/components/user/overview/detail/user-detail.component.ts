import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { User } from 'kypo2-auth';

/**
 * User detail component displayed in expanded row of a table component.
 */
@Component({
  selector: 'kypo2-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent implements OnInit {
  @HostBinding('style.width') width: '100%';
  @Input() data: User;

  ngOnInit(): void {}
}
