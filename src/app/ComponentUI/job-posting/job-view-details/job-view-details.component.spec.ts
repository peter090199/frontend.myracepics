import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobViewDetailsComponent } from './job-view-details.component';

describe('JobViewDetailsComponent', () => {
  let component: JobViewDetailsComponent;
  let fixture: ComponentFixture<JobViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobViewDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
