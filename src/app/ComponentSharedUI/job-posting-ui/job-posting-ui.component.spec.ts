import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostingUIComponent } from './job-posting-ui.component';

describe('JobPostingUIComponent', () => {
  let component: JobPostingUIComponent;
  let fixture: ComponentFixture<JobPostingUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPostingUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPostingUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
