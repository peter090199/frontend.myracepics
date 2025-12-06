import { TestBed } from '@angular/core/testing';

import { NsfwDetectorService } from './nsfw-detector.service';

describe('NsfwDetectorService', () => {
  let service: NsfwDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NsfwDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
