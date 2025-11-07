import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveJobsComponent } from './save-jobs.component';

describe('SaveJobsComponent', () => {
  let component: SaveJobsComponent;
  let fixture: ComponentFixture<SaveJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveJobsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
