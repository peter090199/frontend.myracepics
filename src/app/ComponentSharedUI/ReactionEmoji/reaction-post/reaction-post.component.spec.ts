import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionPostComponent } from './reaction-post.component';

describe('ReactionPostComponent', () => {
  let component: ReactionPostComponent;
  let fixture: ComponentFixture<ReactionPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactionPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactionPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
