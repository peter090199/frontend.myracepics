

import { Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
import { AllSuggestionsModalComponent } from '../all-suggestions-modal/all-suggestions-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientsService } from 'src/app/services/Networking/clients.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { ProfileService } from 'src/app/services/Profile/profile.service';

@Component({
  selector: 'app-peopleand-company',
  templateUrl: './peopleand-company.component.html',
  styleUrls: ['./peopleand-company.component.css']
})
export class PeopleandCompanyComponent implements OnInit {
  people: any[] = [];
  currentUserCode: any;
  followStatuses: { [code: string]: 'none' | 'pending' | 'accepted' } = {};

  constructor(
    private ngZone: NgZone,
    private dialog: MatDialog,
    private clientsService: ClientsService,
    private authServiceCode: AuthService,
    private alert: NotificationsService,
    private profile: ProfileService
  ) {}

   @Input() active: boolean = false; // 🔴 <-- Needed to avoid binding error
    @Output() loaded = new EventEmitter<void>();
  
    ngOnInit(): void {
       if (this.active) {
       // this.getPeopleAndCompany();
      }
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['active'] && changes['active'].currentValue === true) {
       // this.getPeopleAndCompany();
      }
    }

    getPeopleAndCompany(): void {
    this.currentUserCode = this.authServiceCode.getAuthCode();
    console.log('Current user code:', this.currentUserCode);

    this.clientsService.getListClients().subscribe({
      next: (res) => {
        this.people = res.data;
             this.people.forEach(person => {
          if (person.code !== this.currentUserCode) {
            this.clientsService.getFollowStatus(person.code).subscribe((statusRes: any) => {
              this.followStatuses[person.code] = statusRes.follow_status || 'none';
            });
          }
        });
      },
      error: (err) => {
        console.error('Error loading clients:', err);
      }
    });
  }


  openSuggestionsModal(): void {
    this.dialog.open(AllSuggestionsModalComponent, {
      width: '900px',
      data: { people: this.people }
    });
  }

  checkFollowStatus(code: string): void {
    this.clientsService.getFollowStatus(code).subscribe({
      next: (res: any) => {
        this.followStatuses[code] = res.follow_status || 'none';
      },
      error: (err) => {
        console.error(`Error fetching follow status for ${code}:`, err);
        this.followStatuses[code] = 'none';
      }
    });
  }

  AddFollow(code: string): void {
    if (!code) {
      this.alert.toastrWarning('⚠️ No user code provided for follow request.');
      return;
    }

    this.profile.AddFollow(code).subscribe({
      next: (res) => {
        if (res.status === true) {
          this.alert.toastrSuccess(res.message);
          this.followStatuses[code] = res.follow_status || 'none';
          this.checkFollowStatus(code); // Refresh after follow
        }
      },
      error: (error: any) => {
        this.alert.toastrError('Failed to follow user.');
        console.error('❌ Error updating follow status:', error);
      }
    });
  }
}



// import { Component, NgZone, OnInit } from '@angular/core';
// import { AllSuggestionsModalComponent } from '../all-suggestions-modal/all-suggestions-modal.component';
// import { MatDialog,MatDialogRef} from '@angular/material/dialog';
// import { ClientsService } from 'src/app/services/Networking/clients.service';
// import { AuthService } from 'src/app/services/auth.service';
// import { NotificationsService } from 'src/app/services/Global/notifications.service';
// import { ProfileService } from 'src/app/services/Profile/profile.service';
// @Component({
//   selector: 'app-peopleand-company',
//   templateUrl: './peopleand-company.component.html',
//   styleUrls: ['./peopleand-company.component.css']
// })

// export class PeopleandCompanyComponent implements OnInit {
//   people: any[] = [];

//   constructor(private ngZone: NgZone,private dialog: MatDialog,private clientsService:ClientsService,private authServiceCode: AuthService,
//               private alert:NotificationsService, private profile:ProfileService
//   ) { }

//   followStatus: 'none' | 'pending' | 'accepted' = 'none';
//   code:any;
//   currentUserCode:any;


//   ngOnInit(): void {
//     this.currentUserCode = this.authServiceCode.getAuthCode();
//     console.log(this.currentUserCode)
//     // const url = window.location.href;
//     // const codesplit = url.split('/').pop();
//     // this.code = codesplit;


//      this.clientsService.getListClients().subscribe({
//       next: (res) => {
//         this.people = res.data;

//       },
//       error: (err) => {
//         console.error('Error loading clients:', err);
//       }
//     });

//     this.checkFollowStatus();
//   }

//   showAll = false;
//   toggleShowAll() {
//     this.showAll = !this.showAll;
//   }


//   selectedTabIndex = 0;
//   networkSummary = [
//     { icon: 'people', label: 'People & Company', count: 17, route: 'clients' },
//     { icon: 'person', label: 'Following & followers', route: 'following' },
//     { icon: 'group', label: 'Groups', route: 'groups' },
//     { icon: 'event', label: 'Events', route: 'events' },
//     { icon: 'pages', label: 'Pages', count: 68, route: 'pages' },
//     { icon: 'email', label: 'Newsletters', route: 'newsletters' }
//   ];


//   openSuggestionsModal(): void {
//     const dialogRef = this.dialog.open(AllSuggestionsModalComponent, {
//       width: '900px',
//       data: { people: this.people }
//     });
//   }

//   checkFollowStatus() {
//   // Call backend API to check follow status
//   this.clientsService.getFollowStatus(this.hoveredPersonCode).subscribe((res: any) => {
//     this.followStatus = res.follow_status || 'none';
//   });
// }
  

//   AddFollow(): void {
//     if (!this.hoveredPersonCode) {
//       this.alert.toastrWarning('⚠️ No user code provided for follow request.');
//       return;
//     }

//     console.log(this.hoveredPersonCode)

//     this.profile.AddFollow(this.hoveredPersonCode).subscribe({
//       next: (res) => {
//         if(res.status == true)      
//           this.alert.toastrSuccess(res.message);
//           this.followStatus = res.follow_status || 'none';
//           this.checkFollowStatus();
//       },
//       error: (error: any) => {
//         this.alert.toastrError('Failed to follow user.');
//         console.error('❌ Error updating follow status:', error);
//       }
//     });
//   }

//   hoveredPersonCode: string | null = null;

//   onHoverPerson(code: string): void {
//     this.hoveredPersonCode = code;
//     console.log('Hovered person code:', code);
//   }

//   onLeavePerson(): void {
//     this.hoveredPersonCode = null;
//   }


// }

