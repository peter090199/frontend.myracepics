import { TestBed } from '@angular/core/testing';

import { ReactionEmojiService } from './reaction-emoji.service';

describe('ReactionEmojiService', () => {
  let service: ReactionEmojiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReactionEmojiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
