import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersOfGroupSubtableComponent } from './members-of-group-subtable.component';

describe('MembersOfGroupSubtableComponent', () => {
  let component: MembersOfGroupSubtableComponent;
  let fixture: ComponentFixture<MembersOfGroupSubtableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersOfGroupSubtableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersOfGroupSubtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
