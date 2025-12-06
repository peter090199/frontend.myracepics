import { TestBed } from '@angular/core/testing';

import { SightengineWorkflowService } from './sightengine-workflow.service';

describe('SightengineWorkflowService', () => {
  let service: SightengineWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SightengineWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
