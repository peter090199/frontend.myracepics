import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedStatusDialogComponent } from './applied-status-dialog.component';

describe('AppliedStatusDialogComponent', () => {
  let component: AppliedStatusDialogComponent;
  let fixture: ComponentFixture<AppliedStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppliedStatusDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppliedStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
