import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUsersToGroupComponent } from './add-users-to-group.component';

describe('AddUsersToGroupComponent', () => {
  let component: AddUsersToGroupComponent;
  let fixture: ComponentFixture<AddUsersToGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUsersToGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUsersToGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
