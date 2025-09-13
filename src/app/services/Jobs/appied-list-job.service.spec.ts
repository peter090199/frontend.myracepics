import { TestBed } from '@angular/core/testing';

import { AppiedListJobService } from './appied-list-job.service';

describe('AppiedListJobService', () => {
  let service: AppiedListJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppiedListJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
