import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentModalUIComponent } from './comment-modal-ui.component';

describe('CommentModalUIComponent', () => {
  let component: CommentModalUIComponent;
  let fixture: ComponentFixture<CommentModalUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentModalUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentModalUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
