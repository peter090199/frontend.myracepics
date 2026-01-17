import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCartCheckOutComponent } from './view-cart-check-out.component';

describe('ViewCartCheckOutComponent', () => {
  let component: ViewCartCheckOutComponent;
  let fixture: ComponentFixture<ViewCartCheckOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCartCheckOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCartCheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
