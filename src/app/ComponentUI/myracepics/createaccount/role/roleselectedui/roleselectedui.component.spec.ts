import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleselecteduiComponent } from './roleselectedui.component';

describe('RoleselecteduiComponent', () => {
  let component: RoleselecteduiComponent;
  let fixture: ComponentFixture<RoleselecteduiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleselecteduiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleselecteduiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
