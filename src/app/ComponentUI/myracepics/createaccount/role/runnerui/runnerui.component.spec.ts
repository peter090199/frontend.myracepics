import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunneruiComponent } from './runnerui.component';

describe('RunneruiComponent', () => {
  let component: RunneruiComponent;
  let fixture: ComponentFixture<RunneruiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunneruiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunneruiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
