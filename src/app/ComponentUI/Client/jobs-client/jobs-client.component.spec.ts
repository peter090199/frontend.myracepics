import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsClientComponent } from './jobs-client.component';

describe('JobsClientComponent', () => {
  let component: JobsClientComponent;
  let fixture: ComponentFixture<JobsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
