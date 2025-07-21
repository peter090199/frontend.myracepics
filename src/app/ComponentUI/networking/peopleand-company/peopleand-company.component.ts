import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientsService } from 'src/app/services/Networking/clients.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { AllSuggestionsModalComponent } from '../all-suggestions-modal/all-suggestions-modal.component';

@Component({
  selector: 'app-peopleand-company',
  templateUrl: './peopleand-company.component.html',
  styleUrls: ['./peopleand-company.component.css']
})
export class PeopleandCompanyComponent implements OnInit {
  @Input() active: boolean = false;
  @Output() loaded = new EventEmitter<void>();

  people: any[] = [];
  peopleRecentActivity: any[] = [];
  currentUserCode: string = '';
  cnt: number = 0;

  constructor(
    private dialog: MatDialog,
    private clientsService: ClientsService,
    private authService: AuthService,
    private alert: NotificationsService,
    private profile: ProfileService
  ) {}

  ngOnInit(): void {
    if (this.active) {
       // this.loadStatic();
      this.getPeopleAndCompany();
      this.getPeopleRecentActivity();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']?.currentValue) {
      // this.loadStatic();
      this.getPeopleAndCompany();
      this.getPeopleRecentActivity();
    }
  }

  loadStatic(){
     this.people = [
        {
          code: 'USR001',
          fullname: 'Aira Yvette Regio',
          profession: 'Fresh Graduate from University of Cabuyao',
          company: '',
          industry: 'Education',
          photo_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
         {
          code: 'USR001',
          fullname: 'Aira Yvette Regio',
          profession: 'Fresh Graduate from University of Cabuyao',
          company: '',
          industry: 'Education',
          photo_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
         {
          code: 'USR001',
          fullname: 'Aira Yvette Regio',
          profession: 'Fresh Graduate from University of Cabuyao',
          company: '',
          industry: 'Education',
          photo_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
         {
          code: 'USR001',
          fullname: 'Aira Yvette Regio',
          profession: 'Fresh Graduate from University of Cabuyao',
          company: '',
          industry: 'Education',
          photo_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
         {
          code: 'USR001',
          fullname: 'Aira Yvette Regio',
          profession: 'Fresh Graduate from University of Cabuyao',
          company: '',
          industry: 'Education',
          photo_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
         {
          code: 'USR001',
          fullname: 'Aira Yvette Regio',
          profession: 'Fresh Graduate from University of Cabuyao',
          company: '',
          industry: 'Education',
          photo_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
         {
          code: 'USR001',
          fullname: 'Aira Yvette Regio',
          profession: 'Fresh Graduate from University of Cabuyao',
          company: '',
          industry: 'Education',
          photo_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
         {
          code: 'USR001',
          fullname: 'Aira Yvette Regio',
          profession: 'Fresh Graduate from University of Cabuyao',
          company: '',
          industry: 'Education',
          photo_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
        {
          code: 'USR002',
          fullname: 'Jem Aquisio',
          profession: 'Philippine Outsourcing Advocate',
          company: '',
          industry: 'BPO',
          photo_pic: 'https://randomuser.me/api/portraits/women/55.jpg',
          is_online: true,
          source: 'suggested',
          follow_status: 'pending',
          id: 12
        },
        {
          code: 'USR003',
          fullname: 'Marielle S.',
          profession: 'We bring people and opportunities together.',
          company: 'AFW',
          industry: 'Recruitment',
          photo_pic: 'https://randomuser.me/api/portraits/women/60.jpg',
          is_online: true,
          source: 'suggested',
          follow_status: 'accepted',
          id: 21
        },
        {
          code: 'USR004',
          fullname: 'Henry Beltran',
          profession: 'Information Technology at Hyundai Heavy',
          company: 'Hyundai',
          industry: 'Engineering',
          photo_pic: 'https://randomuser.me/api/portraits/men/35.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
        {
          code: 'USR005',
          fullname: 'Alfredo Navarro',
          profession: 'Java Analyst – Team Lead @ RCG Global Services',
          company: 'RCG',
          industry: 'IT',
          photo_pic: 'https://randomuser.me/api/portraits/men/45.jpg',
          is_online: true,
          source: 'history',
          follow_status: 'pending',
          id: 5
        },
        {
          code: 'USR006',
          fullname: 'Vartika Bhagwat',
          profession: 'Senior Test Engineer at Netlink Software Group',
          company: 'Netlink',
          industry: 'Software',
          photo_pic: 'https://randomuser.me/api/portraits/women/65.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
        {
          code: 'USR007',
          fullname: 'Tanzeel Ahmad',
          profession: 'Carpenter at Available Upon Request',
          company: '',
          industry: 'Construction',
          photo_pic: 'https://randomuser.me/api/portraits/men/71.jpg',
          is_online: false,
          source: 'suggested',
          follow_status: 'none',
          id: null
        },
        {
          code: 'USR008',
          fullname: 'Jay Montebon',
          profession: '',
          company: '',
          industry: '',
          photo_pic: 'https://randomuser.me/api/portraits/men/23.jpg',
          is_online: true,
          source: 'history',
          follow_status: 'accepted',
          id: 11
        }
      ];

  }
  getPeopleAndCompany(): void {
    this.currentUserCode = this.authService.getAuthCode();

    this.clientsService.getPeopleyoumayknow().subscribe({
      next: (res) => {
        this.people = res.data.map((person: any) => ({
          ...person,
          follow_status: person.follow_status || 'none',
          follow_id: null // optional follow_id for future unfollowing
        }));
        this.cnt = res.count;
        this.loaded.emit();
      },
      error: (err) => {
        console.error('Error loading suggestions:', err);
        this.alert.toastrError('❌ Failed to load suggestions.');
      }
    });
  }


    getPeopleRecentActivity(): void {
    this.currentUserCode = this.authService.getAuthCode();

    this.clientsService.getPeopleRecentActivity().subscribe({
      next: (res) => {
        this.peopleRecentActivity = res.data.map((person: any) => ({
          ...person,
          follow_status: person.follow_status || 'none',
          follow_id: null 
        }));
        this.cnt = res.count;
        this.loaded.emit();
      },
      error: (err) => {
        console.error('Error loading suggestions:', err);
        this.alert.toastrError('❌ Failed to load suggestions.');
      }
    });
  }


  recentActivities = [
  {
    fullname: 'Marielle S.',
    action: 'Viewed your profile',
    time: '10 minutes ago'
  },
  {
    fullname: 'Jay Montebon',
    action: 'Sent you a connection request',
    time: '2 hours ago'
  },
  {
    fullname: 'Aira Yvette Regio',
    action: 'Liked your post',
    time: 'Yesterday'
  }
];


  openSuggestionsModal(): void {
    this.dialog.open(AllSuggestionsModalComponent, {
      width: '900px',
      data: { people: this.people }
    });
  }

  AddConnect(code: string, fullName: string, follow_status: string, id: number): void {
  if (!code) {
    this.alert.toastrWarning('⚠️ No user code provided.');
    return;
  }
  const currentStatus = follow_status || 'none';

  let confirmMessage = '';
  let successAction = '';

  switch (currentStatus) {
    case 'none':
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
        currentStatus === 'accepted'
          ? this.profile.Unfollow(id)
          : this.profile.AddFollow(code);

      action$.subscribe({
        next: (res: any) => {
          if (res.status === true || res.success === true) {
            this.alert.toastrSuccess(successAction);
             follow_status = res.follow_status || 'none';
                this.getPeopleAndCompany();
                this.getPeopleRecentActivity();
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

  // AddConnect(code: string, fullName: string, follow_status: string,id: number): void {
  //   if (!code) {
  //     this.alert.toastrWarning('⚠️ No user code provided.');
  //     return;
  //   }
  //   console.log(follow_status)
  //   const person = this.people.find(p => p.code === code);
  //   const currentStatus = person.follow_status;

  //   let confirmMessage = '';
  //   let successAction = '';

  //   switch (currentStatus) {
  //     case 'none':
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
  //         currentStatus === 'accepted'
  //           ? this.profile.Unfollow(id)
  //           : this.profile.AddFollow(code);

  //       action$.subscribe({
  //         next: (res: any) => {
  //           if (res.status === true || res.success === true) {
  //             this.alert.toastrSuccess(successAction);
  //             person.follow_status = res.follow_status ||'none';

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
  // }


}
