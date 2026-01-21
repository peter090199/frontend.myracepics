import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSelectRoleUIComponent } from './google-select-role-ui.component';

describe('GoogleSelectRoleUIComponent', () => {
  let component: GoogleSelectRoleUIComponent;
  let fixture: ComponentFixture<GoogleSelectRoleUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleSelectRoleUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleSelectRoleUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
