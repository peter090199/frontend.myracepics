import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingFollowingComponent } from './pending-following.component';

describe('PendingFollowingComponent', () => {
  let component: PendingFollowingComponent;
  let fixture: ComponentFixture<PendingFollowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingFollowingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingFollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
