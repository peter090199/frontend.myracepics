import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseOnRecenActivityComponent } from './base-on-recen-activity.component';

describe('BaseOnRecenActivityComponent', () => {
  let component: BaseOnRecenActivityComponent;
  let fixture: ComponentFixture<BaseOnRecenActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseOnRecenActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseOnRecenActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
