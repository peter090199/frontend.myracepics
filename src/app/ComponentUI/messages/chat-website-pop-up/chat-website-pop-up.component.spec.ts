import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWebsitePopUPComponent } from './chat-website-pop-up.component';

describe('ChatWebsitePopUPComponent', () => {
  let component: ChatWebsitePopUPComponent;
  let fixture: ComponentFixture<ChatWebsitePopUPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatWebsitePopUPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWebsitePopUPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
