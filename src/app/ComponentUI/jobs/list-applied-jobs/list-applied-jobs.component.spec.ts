import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppliedJobsComponent } from './list-applied-jobs.component';

describe('ListAppliedJobsComponent', () => {
  let component: ListAppliedJobsComponent;
  let fixture: ComponentFixture<ListAppliedJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAppliedJobsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAppliedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
