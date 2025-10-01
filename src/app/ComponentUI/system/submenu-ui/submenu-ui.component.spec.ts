import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuUIComponent } from './submenu-ui.component';

describe('SubmenuUIComponent', () => {
  let component: SubmenuUIComponent;
  let fixture: ComponentFixture<SubmenuUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmenuUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmenuUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
