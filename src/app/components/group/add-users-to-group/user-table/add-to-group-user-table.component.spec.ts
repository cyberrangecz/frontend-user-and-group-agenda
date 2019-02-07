import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToGroupUserTableComponent } from './add-to-group-user-table.component';

describe('AddToGroupUserTableComponent', () => {
  let component: AddToGroupUserTableComponent;
  let fixture: ComponentFixture<AddToGroupUserTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToGroupUserTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToGroupUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
