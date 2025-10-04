import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersUIComponent } from './users-ui.component';

describe('UsersUIComponent', () => {
  let component: UsersUIComponent;
  let fixture: ComponentFixture<UsersUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
