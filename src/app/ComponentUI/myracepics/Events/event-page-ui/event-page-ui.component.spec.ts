import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPageUIComponent } from './event-page-ui.component';

describe('EventPageUIComponent', () => {
  let component: EventPageUIComponent;
  let fixture: ComponentFixture<EventPageUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventPageUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPageUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
