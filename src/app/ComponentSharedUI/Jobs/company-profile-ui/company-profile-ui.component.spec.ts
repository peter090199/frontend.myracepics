import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileUIComponent } from './company-profile-ui.component';

describe('CompanyProfileUIComponent', () => {
  let component: CompanyProfileUIComponent;
  let fixture: ComponentFixture<CompanyProfileUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyProfileUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
