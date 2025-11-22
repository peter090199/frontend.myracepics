import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { ClientsService } from 'src/app/services/Networking/clients.service';
import { ProfileService } from 'src/app/services/Profile/profile.service';

@Component({
  selector: 'app-user-and-recruiter',
  templateUrl: './user-and-recruiter.component.html',
  styleUrls: ['./user-and-recruiter.component.css']
})
export class UserAndRecruiterComponent implements OnInit {

  isLoading = false;
  skeletonRows: number[] = [];
  hasMoreData = true;
  people: any[] = [];
  peopleInvites: any[] = [];
  peopleRecentActivity: any[] = [];
  currentUserCode: string = '';
  cnt: number = 0;
  limit = 10;
  page = 1;


  constructor(private clientsService: ClientsService, private authService: AuthService,
    private alert: NotificationsService, private profile: ProfileService

  ) { }

  ngOnInit(): void {
    this.loadTabData(0);
  }


  loadTabData(index: number): void {
    if (index === 0) {
      this.getPeopleyoumayknow();
      this.getPeopleRecentActivity();
    }
    else {
      this.getPeopleRecentActivity();
    }
  }


  getPeopleRecentActivity(): void {
    if (this.isLoading || !this.hasMoreData) return;

    this.isLoading = true;
    this.currentUserCode = this.authService.getAuthCode();
    this.skeletonRows = Array.from({ length: this.limit }, (_, i) => i);

    this.clientsService.getPeopleRecentActivity().subscribe({
      next: (res) => {
        this.skeletonRows = [];
        const newData = (res.data || []).map((person: any) => ({
          ...person,
          follow_status: person.follow_status || 'not_following',
          follow_id: person.follow_id || null,
          role_code: person.role_code
        }));

        this.peopleRecentActivity.push(...newData);
        this.page++;
        this.hasMoreData = newData.length === this.limit;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading recent activity:', err);
        this.alert.toastrError('❌ Failed to load recent activity.');
        this.isLoading = false;
      }
    });
  }



  getPeopleyoumayknow(): void {
    this.currentUserCode = this.authService.getAuthCode();

    this.clientsService.getPeopleyoumayknow().subscribe({
      next: (res) => {
        this.people = res.data;
        this.cnt = res.count || 0;
      },
      error: (err) => {
        console.error('Error loading suggestions:', err);
        this.alert.toastrError('❌ Failed to load suggestions.');
      }
    });
  }

   AddConnect(code: string, fullName: string, follow_status: string, id: number): void {
    if (!code) {
      this.alert.toastrWarning('⚠️ No user code provided.');
      return;
    }

    let confirmMessage = '';
    let successAction = '';
    switch (follow_status) {
      case 'not_following':
        confirmMessage = 'Send a follow request to this user?';
        successAction = 'Follow request sent.';
        break;
      case 'pending':
        confirmMessage = 'Cancel your pending follow request?';
        successAction = 'Follow request canceled.';
        break;
      case 'accepted':
        confirmMessage = 'Unfollow this user?';
        successAction = 'Unfollowed successfully.';
        break;
    }

    this.alert.popupWarning(fullName, confirmMessage).then((result) => {
      if (result.value) {
        const action$ =
          follow_status === 'accepted'
            ? this.profile.Unfollow(id)
            : this.profile.AddFollow(code);
         this.getPeopleRecentActivity();
        action$.subscribe({
          next: (res) => {
            if (res.status === true || res.success === true) {
              this.alert.toastrSuccess(res.message);

             // ✅ Update UI without reloading
              this.peopleRecentActivity = this.peopleRecentActivity.map(p =>
                p.code === code ? { ...p, follow_status: res.follow_status} : p
              );
              this.people = this.people.map(p =>
                p.code === code ? { ...p, follow_status: res.follow_status} : p
              );
             
            } else {
              this.alert.toastrError(res.message || 'Action failed.');
            }
          },
          error: (err) => {
            this.alert.toastrError(err.error?.message || 'Something went wrong.');
            console.error(err);
          }
        });


      }
    });
  }



  onScroll(event: any): void {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !this.isLoading && this.hasMoreData) {
      this.getPeopleyoumayknow();
    }
  }





}
