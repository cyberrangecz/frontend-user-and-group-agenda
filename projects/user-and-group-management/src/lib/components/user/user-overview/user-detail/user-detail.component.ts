import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {User} from 'kypo2-auth';

@Component({
  selector: 'kypo2-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': "'100%'"
  }
})
export class UserDetailComponent implements OnInit {

  @Input() data: User;

  ngOnInit(): void {
  }
}
