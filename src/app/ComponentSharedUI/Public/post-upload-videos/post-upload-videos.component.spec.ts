import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostUploadVideosComponent } from './post-upload-videos.component';

describe('PostUploadVideosComponent', () => {
  let component: PostUploadVideosComponent;
  let fixture: ComponentFixture<PostUploadVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostUploadVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostUploadVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
