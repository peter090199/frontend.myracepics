import { TestBed } from '@angular/core/testing';

import { AppliedQuestionsService } from './applied-questions.service';

describe('AppliedQuestionsService', () => {
  let service: AppliedQuestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppliedQuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
