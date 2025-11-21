import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ClientsService } from 'src/app/services/Networking/clients.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { AllSuggestionsModalComponent } from './all-suggestions-modal/all-suggestions-modal.component';


@Component({
  selector: 'app-networking',
  templateUrl: './networking.component.html',
  styleUrls: ['./networking.component.css']
})
export class NetworkingComponent implements OnInit, OnChanges {
   people = [
    { name: 'Ana Santos', title: 'Frontend Developer', mutuals: 5, following: false },
    { name: 'Mark Reyes', title: 'Project Manager', mutuals: 3, following: true },
    { name: 'Liza Cruz', title: 'UI/UX Designer', mutuals: 8, following: false }
  ];

recruiters = [
  { 
    name: 'TechCorp HR', 
    position: 'Talent Acquisition', 
    location: 'Manila, Philippines', 
    logo: 'assets/images/company1.png', 
    following: false 
  },
  { 
    name: 'DevSolutions HR', 
    position: 'Recruiter', 
    location: 'Cebu City, Philippines', 
    logo: 'assets/images/company2.png', 
    following: true 
  }
];

  invites = [
    { name: 'Jomar Valdez', title: 'Backend Dev', mutuals: 1 }
  ];

  toggleFollow(p: any) {
    p.following = !p.following;
  }


  @Input() active: boolean = false;
  @Output() loaded = new EventEmitter<void>();

  // people: any[] = [];
  peopleInvites: any[] = [];               // Suggestions (People you may know)
  peopleRecentActivity: any[] = []; // Recent Activity
  currentUserCode: string = '';
  cnt: number = 0;

  isLoading = false;
  skeletonRows: number[] = [];
  page = 1;
  limit = 10;
  hasMoreData = true;

  // ✅ New tab handling
  selectedTabIndex: number = 0;

  constructor(
    private dialog: MatDialog,
    private clientsService: ClientsService,
    private authService: AuthService,
    private alert: NotificationsService,
    private profile: ProfileService
  ) { }

  ngOnInit(): void {
    this.loadTabData(this.selectedTabIndex);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']?.currentValue) {
      this.loadTabData(this.selectedTabIndex);
    }
  }

  loadTabData2(index: number): void {
  if (index === 2) {
    // Only loads when clicking Invites tab
    this.getPendingFollowRequests();
  }
}


  /** ✅ Handle tab change */
  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTabIndex = event.index;
    this.resetData();
    this.loadTabData(this.selectedTabIndex);
  }

  /** ✅ Load data depending on tab */
  private loadTabData(index: number): void {
    if (index === 0) {
      this.getPeopleyoumayknow();
      this.getPeopleRecentActivity();
      this.getPendingFollowRequests();
    } else if (index === 1) {
      // Future tab
    }
  }

  /** Reset data when tab is reloaded */
  private resetData(): void {
    this.page = 1;
    this.people = [];
    this.peopleRecentActivity = [];
    this.hasMoreData = true;
  }

  /** Infinite scroll */
  onScroll(event: any): void {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !this.isLoading && this.hasMoreData) {
      this.getPeopleRecentActivity();
    }
  }

  /** Load Suggestions */
  getPeopleyoumayknow(): void {
    this.currentUserCode = this.authService.getAuthCode();

    this.clientsService.getPeopleyoumayknow().subscribe({
      next: (res) => {
        this.people = res.data || [];
        this.cnt = res.count || 0;
      },
      error: (err) => {
        console.error('Error loading suggestions:', err);
        this.alert.toastrError('❌ Failed to load suggestions.');
      }
    });
  }

  /** Load Recent Activity with Pagination */
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

  getPendingFollowRequests(): void {
    this.clientsService.getPendingFollowRequests().subscribe({
      next: (res) => {
        this.peopleInvites = res.data;
      },
      error: (err) => {
        console.error('Error loading pending follow requests:', err);
      }
    });
  }

  /** Open All Suggestions Modal */
  openSuggestionsModal(): void {
    this.dialog.open(AllSuggestionsModalComponent, {
      width: '900px',
      data: { people: this.people }
    });
  }

  /** Follow / Unfollow / Cancel Request */
  // AddConnect(code: string, fullName: string, follow_status: string, id: number): void {
  //   if (!code) {
  //     this.alert.toastrWarning('⚠️ No user code provided.');
  //     return;
  //   }

  //   let confirmMessage = '';
  //   let successAction = '';
  //   switch (follow_status) {
  //     case 'not_following':
  //       confirmMessage = 'Send a follow request to this user?';
  //       successAction = 'Follow request sent.';
  //       break;
  //     case 'pending':
  //       confirmMessage = 'Cancel your pending follow request?';
  //       successAction = 'Follow request canceled.';
  //       break;
  //     case 'accepted':
  //       confirmMessage = 'Unfollow this user?';
  //       successAction = 'Unfollowed successfully.';
  //       break;
  //   }

  //   this.alert.popupWarning(fullName, confirmMessage).then((result) => {
  //     if (result.value) {
  //       const action$ =
  //         follow_status === 'accepted'
  //           ? this.profile.Unfollow(id)
  //           : this.profile.AddFollow(code);

  //       action$.subscribe({
  //         next: (res) => {
  //           if (res.status === true || res.success === true) {
  //             this.alert.toastrSuccess(successAction);

  //             // ✅ Update UI without reloading
  //             this.peopleRecentActivity = this.peopleRecentActivity.map(p =>
  //               p.code === code ? { ...p, follow_status: res.follow_status || 'not_following' } : p
  //             );
  //             this.people = this.people.map(p =>
  //               p.code === code ? { ...p, follow_status: res.follow_status || 'not_following' } : p
  //             );
  //           } else {
  //             this.alert.toastrError(res.message || 'Action failed.');
  //           }
  //         },
  //         error: (err) => {
  //           this.alert.toastrError(err.error?.message || 'Something went wrong.');
  //           console.error(err);
  //         }
  //       });
  //     }
  //   });
  //}



  ConnectInvites(code: any, requesterFname: string): void {
    if (!code) {
      this.alert.toastrWarning('⚠️ No user code provided for follow request.');
      return;
    }

    const fullName = `${requesterFname}`;
    const confirmMessage = `Accept follow request from ${fullName}?`;

    this.alert.popupWarning(fullName, confirmMessage).then((result) => {
      if (result.value) {
        this.clientsService.acceptFollowRequest(code).subscribe({
          next: () => {
            this.alert.toastrSuccess(`You are now connected with ${fullName}.`);
            this.getPendingFollowRequests();
          },
          error: (error: any) => {
            this.alert.toastrError('❌ Failed to accept follow request.');
            console.error('Error on follow request:', error);
          }
        });
      }
    });
  }




}
