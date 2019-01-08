import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  links: { path: string, label: string }[];

  constructor() { }

  ngOnInit() {
    this.links = [
      {
        path: '/user',
        label: 'User management'
      },
      {
        path: '/group',
        label: 'Group management'
      }
    ];
  }
}

