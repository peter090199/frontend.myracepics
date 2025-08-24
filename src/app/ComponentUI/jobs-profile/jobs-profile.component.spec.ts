import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsProfileComponent } from './jobs-profile.component';

describe('JobsProfileComponent', () => {
  let component: JobsProfileComponent;
  let fixture: ComponentFixture<JobsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
