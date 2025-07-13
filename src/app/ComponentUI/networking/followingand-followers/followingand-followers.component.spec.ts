import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FollowingandFollowersComponent } from './followingand-followers.component';
describe('FollowingandFollowersComponent', () => {
  let component: FollowingandFollowersComponent;
  let fixture: ComponentFixture<FollowingandFollowersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowingandFollowersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingandFollowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
