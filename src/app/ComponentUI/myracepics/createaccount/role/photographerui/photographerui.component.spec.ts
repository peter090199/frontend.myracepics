import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotographeruiComponent } from './photographerui.component';

describe('PhotographeruiComponent', () => {
  let component: PhotographeruiComponent;
  let fixture: ComponentFixture<PhotographeruiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotographeruiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotographeruiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
