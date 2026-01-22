import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFilterDialogComponent } from './mobile-filter-dialog.component';

describe('MobileFilterDialogComponent', () => {
  let component: MobileFilterDialogComponent;
  let fixture: ComponentFixture<MobileFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileFilterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
