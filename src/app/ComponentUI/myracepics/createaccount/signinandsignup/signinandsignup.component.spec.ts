import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninandsignupComponent } from './signinandsignup.component';

describe('SigninandsignupComponent', () => {
  let component: SigninandsignupComponent;
  let fixture: ComponentFixture<SigninandsignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigninandsignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninandsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
