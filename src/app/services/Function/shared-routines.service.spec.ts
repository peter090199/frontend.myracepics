import { TestBed } from '@angular/core/testing';

import { SharedRoutinesService } from './shared-routines.service';

describe('SharedRoutinesService', () => {
  let service: SharedRoutinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedRoutinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
