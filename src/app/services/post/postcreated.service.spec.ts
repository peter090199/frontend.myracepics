import { TestBed } from '@angular/core/testing';

import { PostcreatedService } from './postcreated.service';

describe('PostcreatedService', () => {
  let service: PostcreatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostcreatedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
