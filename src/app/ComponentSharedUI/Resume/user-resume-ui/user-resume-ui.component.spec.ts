import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResumeUIComponent } from './user-resume-ui.component';

describe('UserResumeUIComponent', () => {
  let component: UserResumeUIComponent;
  let fixture: ComponentFixture<UserResumeUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserResumeUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResumeUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
