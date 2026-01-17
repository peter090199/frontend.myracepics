import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarUIComponent } from './toolbar-ui.component';

describe('ToolbarUIComponent', () => {
  let component: ToolbarUIComponent;
  let fixture: ComponentFixture<ToolbarUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
