import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRolesToGroupComponent } from './add-roles-to-group.component';

describe('AddRolesToGroupComponent', () => {
  let component: AddRolesToGroupComponent;
  let fixture: ComponentFixture<AddRolesToGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRolesToGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRolesToGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
