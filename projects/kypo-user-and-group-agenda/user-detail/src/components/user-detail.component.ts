import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@muni-kypo-crp/user-and-group-model';
import { takeWhile } from 'rxjs/operators';
import { USER_DATA_ATTRIBUTE_NAME } from '@muni-kypo-crp/user-and-group-agenda';
import { SentinelBaseDirective } from '@sentinel/common';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'kypo-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent extends SentinelBaseDirective implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  user: User;

  constructor(private activeRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.initTable();
  }

  private initTable() {
    this.activeRoute.data.pipe(takeWhile(() => this.isAlive)).subscribe((data) => {
      this.user = data[USER_DATA_ATTRIBUTE_NAME];
    });
  }
}
