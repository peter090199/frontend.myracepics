import { Component, EventEmitter, Input, NgZone, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AllSuggestionsModalComponent } from './all-suggestions-modal/all-suggestions-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientsService } from 'src/app/services/Networking/clients.service';

@Component({
  selector: 'app-networking',
  templateUrl: './networking.component.html',
  styleUrls: ['./networking.component.css']
})
export class NetworkingComponent implements OnInit, OnChanges {
  people: any[] = [];
  users: any[] = [];
  count = 0;
  pendingCnt = 0;
  showAll = false;
  isLoading = false;
  selectedTabIndex = 0;
  cnt = 0;

  @Input() active: boolean = false;
  @Output() loaded = new EventEmitter<void>();

  networkSummary: any[] = [
    { icon: 'badge', label: 'People & Company', count: 0, route: 'people' },
    { icon: 'people_alt', label: 'Connected', count: 0, route: 'connected' },
    { icon: 'group', label: 'Accept Invites', count: 0, route: 'accept-invites' }
  ];

  constructor(
    private ngZone: NgZone,
    private dialog: MatDialog,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    if (this.active) {
      this.loadClients();
      this.getPeopleRecentActivity();
      
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && this.active) {
      this.loadClients();
      this.getPeopleRecentActivity();
    }
  }

  getfollowingPending(): void {
    this.isLoading = true;
    this.clientsService.getfollowingPending().subscribe({
      next: (res) => {
        this.people = res.data;
        this.pendingCnt = res.count;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pending follow requests:', err);
        this.isLoading = false;
      }
    });
  }

  getPeopleRecentActivity(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.clientsService.getPeopleRecentActivity().subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.users = res.data || [];
          this.isLoading = false;
        });
      },
      error: (err) => {
        console.error('Error loading suggestions:', err);
        this.isLoading = false;
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
        this.getfollowingPending();
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.isLoading = false;
      }
    });
  }

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 1200);
  }

  updateTabCount(index: number, newCount: any): void {
    this.networkSummary[index].count = newCount;
  }

  onComponentLoaded() {
    this.isLoading = false;
    this.clientsService.getPeopleyoumayknow().subscribe({
      next: (res) => {
        this.cnt = res.count;
        // this.getPeopleRecentActivity();
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
