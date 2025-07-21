// import { Component, Input, NgZone, OnInit, SimpleChanges } from '@angular/core';
// import { AllSuggestionsModalComponent } from './all-suggestions-modal/all-suggestions-modal.component';
// import { MatDialog } from '@angular/material/dialog';
// import { ClientsService } from 'src/app/services/Networking/clients.service';

// @Component({
//   selector: 'app-networking',
//   templateUrl: './networking.component.html',
//   styleUrls: ['./networking.component.css']
// })
// export class NetworkingComponent implements OnInit {
//   people: any[] = [];
//   count: number = 0;
//   showAll = false;
//   networkSummary: any[] = [];

//   constructor(
//     private ngZone: NgZone,
//     private dialog: MatDialog,
//     private clientsService: ClientsService
//   ) {}

//   ngOnInit(): void {
//     this.clientsService.getListClients().subscribe({
//       next: (res) => {
//         this.people = res.data;
//         this.count = res.count;
//         console.log('People count:', this.count);

//         // ✅ Now dynamically assign networkSummary using the actual count
//         this.networkSummary = [
//           { icon: 'people', label: 'People & Company', count: this.count, route: 'people' },
//           { icon: 'person', label: 'Followers', count: this.count, route: 'followers' },
//           { icon: 'person', label: 'Following', count: this.count, route: 'following' },
//           { icon: 'group', label: 'Invites Pending', count: this.count, route: 'groups' },
//           // { icon: 'event', label: 'Events', route: 'events' },
//           // { icon: 'pages', label: 'Pages', count: 68, route: 'pages' },
//           // { icon: 'email', label: 'Newsletters', route: 'newsletters' }
//         ];
//       },
//       error: (err) => {
//         console.error('Error loading clients:', err);
//       }
//     });
//   }


//     @Input() active: boolean = false;

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['active'] && this.active) {
//       this.getfollowingPending();
//     }
//   }
  
//   isLoading = false;
//   selectedTabIndex: number = 0;

//   onTabChange(event: any) {
//     this.selectedTabIndex = event.index;
//     this.isLoading = true;
//     // Optional: set timeout in case the child doesn't emit
//     setTimeout(() => {
//       this.isLoading = false;
//     }, 1500); // fallback to auto-hide after 1 second
//   }

//   onComponentLoaded() {
//     this.isLoading = false;
//   }

//   getfollowingPending(): void {
//      this.isLoading = false;
//     this.clientsService.getfollowingPending().subscribe({
//       next: (res) => {
//         this.people = res.data;
//       },
//       error: (err) => {
//         console.error('Error loading pending follow requests:', err);
//       }
//     });
//   }

//   toggleShowAll(): void {
//     this.showAll = !this.showAll;
//   }

//   openSuggestionsModal(): void {
//     this.dialog.open(AllSuggestionsModalComponent, {
//       width: '900px',
//       data: { people: this.people }
//     });
//   }
// }
import { Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
import { AllSuggestionsModalComponent } from './all-suggestions-modal/all-suggestions-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientsService } from 'src/app/services/Networking/clients.service';

@Component({
  selector: 'app-networking',
  templateUrl: './networking.component.html',
  styleUrls: ['./networking.component.css']
})
export class NetworkingComponent implements OnInit {
  people: any[] = [];
  count: number = 0;
  pendingCnt: number = 0;
  showAll = false;
  isLoading = false;
  selectedTabIndex: number = 0;
  cnt:number = 0;


  networkSummary: any[] = [
    { icon: 'people', label: 'People & Company', count: this.count, route: 'people' },
    { icon: 'person', label: 'Followers', count: this.count, route: 'followers' },
    { icon: 'person', label: 'Following', count: 0, route: 'following' },
    { icon: 'group', label: 'Invites Pending', count: this.count, route: 'groups' },
  ];

  constructor(
    private ngZone: NgZone,
    private dialog: MatDialog,
    private clientsService: ClientsService
  ) {}


@Input() active: boolean = false; // 🔴 <-- Needed to avoid binding error
  @Output() loaded = new EventEmitter<void>();
  ngOnInit(): void {
     if (this.active) {
      this.loadClients();
    }
  }

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && this.active) {
      this.loadClients();
    }
  }
  getfollowingPending(): void {
     this.isLoading = false;
    this.clientsService.getfollowingPending().subscribe({
      next: (res) => {
        this.people = res.data;
         this.pendingCnt = res.count;
         console.log(this.pendingCnt)
      },
      error: (err) => {
        console.error('Error loading pending follow requests:', err);
      }
    });
  }


  loadClients(): void {
    this.isLoading = true;
    this.clientsService.getListClients().subscribe({
      next: (res) => {
        this.people = res.data;
        this.count = res.count;
        this.isLoading = false;

        this.networkSummary[0].count = res.count;

      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.isLoading = false;
      }
    });

     this.getfollowingPending();
  }

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }
  updateTabCount(index: number, newCount: any): void {
    this.networkSummary[index].count = newCount;
  }

  onComponentLoaded() {
    this.isLoading = false;
    this.clientsService.getPeopleyoumayknow().subscribe({
      next: (res) => {
       this.cnt = res.count;
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

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }
}
