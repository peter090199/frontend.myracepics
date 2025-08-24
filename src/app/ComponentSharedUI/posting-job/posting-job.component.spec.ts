import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingJobComponent } from './posting-job.component';

describe('PostingJobComponent', () => {
  let component: PostingJobComponent;
  let fixture: ComponentFixture<PostingJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostingJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
