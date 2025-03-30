import { TestBed } from '@angular/core/testing';

import { PostUploadImagesService } from './post-upload-images.service';

describe('PostUploadImagesService', () => {
  let service: PostUploadImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostUploadImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
