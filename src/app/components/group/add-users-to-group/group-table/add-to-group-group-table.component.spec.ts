import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToGroupGroupTableComponent } from './add-to-group-group-table.component';

describe('AddToGroupGroupTableComponent', () => {
  let component: AddToGroupGroupTableComponent;
  let fixture: ComponentFixture<AddToGroupGroupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToGroupGroupTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToGroupGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
