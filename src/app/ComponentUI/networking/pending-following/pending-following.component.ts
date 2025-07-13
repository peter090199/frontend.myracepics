import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ClientsService } from 'src/app/services/Networking/clients.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-pending-following',
  templateUrl: './pending-following.component.html',
  styleUrls: ['./pending-following.component.css']
})
export class PendingFollowingComponent implements OnInit {

  people: any[] = [];

 @Input() active: boolean = false; // 🔴 <-- Needed to avoid binding error
  @Output() loaded = new EventEmitter<void>();
  constructor(private clientsService: ClientsService,private alert:NotificationsService, private authServiceCode: AuthService

  ) {}
currentUserCode:any;
  ngOnInit(): void {
     if (this.active) {
          this.currentUserCode = this.authServiceCode.getAuthCode();
          this.getPendingFollowRequests();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && changes['active'].currentValue === true) {
      this.getPendingFollowRequests();
    }
  }

  getPendingFollowRequests(): void {
    this.clientsService.getPendingFollowRequests().subscribe({
      next: (res) => {
        this.people = res.data;
      },
      error: (err) => {
        console.error('Error loading pending follow requests:', err);
      }
    });
  }

AddConnect(code: any): void {
  if (!code) {
    this.alert.toastrWarning('⚠️ No user code provided for follow request.');
    return;
  }

  console.log('Sending PUT for code:', code);

  this.clientsService.acceptFollowRequest(code).subscribe({
    next: (res:any) => {
      this.alert.toastrSuccess(res.message);
    },
    error: (error: any) => {
      this.alert.toastrError('❌ Failed to accept follow request.');
      console.error('Error on follow request:', error);
    }
  });
}

  // getfollowingPending(): void {
  //   this.clientsService.getfollowingPending().subscribe({
  //     next: (res) => {
  //       this.people = res.data;
        
  //        this.loaded.emit();
  //     },
  //     error: (err) => {
  //       console.error('Error loading pending follow requests:', err);
  //     }
  //   });
  // }
}

