import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupControlsComponent } from './group-controls.component';

describe('GroupControlsComponent', () => {
  let component: GroupControlsComponent;
  let fixture: ComponentFixture<GroupControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
