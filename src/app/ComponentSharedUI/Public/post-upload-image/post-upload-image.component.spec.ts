import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostUploadImageComponent } from './post-upload-image.component';

describe('PostUploadImageComponent', () => {
  let component: PostUploadImageComponent;
  let fixture: ComponentFixture<PostUploadImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostUploadImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostUploadImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
