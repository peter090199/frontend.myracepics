import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsubmenuUIComponent } from './editsubmenu-ui.component';

describe('EditsubmenuUIComponent', () => {
  let component: EditsubmenuUIComponent;
  let fixture: ComponentFixture<EditsubmenuUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditsubmenuUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditsubmenuUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
