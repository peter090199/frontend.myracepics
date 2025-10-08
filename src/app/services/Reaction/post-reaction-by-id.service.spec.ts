import { TestBed } from '@angular/core/testing';

import { PostReactionByIdService } from './post-reaction-by-id.service';

describe('PostReactionByIdService', () => {
  let service: PostReactionByIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostReactionByIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
