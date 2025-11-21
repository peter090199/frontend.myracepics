import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAndRecruiterComponent } from './user-and-recruiter.component';

describe('UserAndRecruiterComponent', () => {
  let component: UserAndRecruiterComponent;
  let fixture: ComponentFixture<UserAndRecruiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAndRecruiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAndRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
