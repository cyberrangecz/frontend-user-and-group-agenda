import { ChangeDetectorRef } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { User, UserRole } from '@muni-kypo-crp/user-and-group-model';
import { UserMaterialModule } from '../user-material.module';
import { UserDetailComponent } from './user-detail.component';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let cd: ChangeDetectorRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UserMaterialModule],
      declarations: [UserDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    cd = fixture.componentRef.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user roles', fakeAsync(() => {
    const role1 = new UserRole();
    role1.roleType = 'test role type';
    role1.microserviceName = 'test microservice-registration name';
    const role2 = new UserRole();
    role2.roleType = 'test2 role type';
    role2.microserviceName = 'test2 microservice-registration name';
    const user = new User();
    user.roles = [role1, role2];
    component.data = user;

    detectChanges();

    const elements = fixture.debugElement.queryAll(By.css('mat-list-item'));
    expect(elements.length).toEqual(user.roles.length);
    elements.forEach((el, index) => {
      const paragraphEls = el.queryAll(By.css('p'));
      expect(paragraphEls.length).toEqual(2);
      expect(paragraphEls[0].nativeElement.innerHTML.toLowerCase()).toEqual(user.roles[index].roleType.toLowerCase());
      expect(paragraphEls[1].nativeElement.innerHTML.toLowerCase()).toEqual(
        user.roles[index].microserviceName.toLowerCase()
      );
    });
  }));

  function detectChanges() {
    cd.markForCheck();
    fixture.autoDetectChanges();
    flush();
  }
});
