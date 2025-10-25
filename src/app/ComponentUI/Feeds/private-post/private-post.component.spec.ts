import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatePostComponent } from './private-post.component';

describe('PrivatePostComponent', () => {
  let component: PrivatePostComponent;
  let fixture: ComponentFixture<PrivatePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivatePostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
