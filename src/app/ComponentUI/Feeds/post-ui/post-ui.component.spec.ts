import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostUIComponent } from './post-ui.component';

describe('PostUIComponent', () => {
  let component: PostUIComponent;
  let fixture: ComponentFixture<PostUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
