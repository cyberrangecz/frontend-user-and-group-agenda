import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesOfGroupSubtableComponent } from './roles-of-group-subtable.component';

describe('RolesOfGroupSubtableComponent', () => {
  let component: RolesOfGroupSubtableComponent;
  let fixture: ComponentFixture<RolesOfGroupSubtableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesOfGroupSubtableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesOfGroupSubtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
