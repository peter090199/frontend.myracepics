import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ClientsService } from 'src/app/services/Networking/clients.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';

@Component({
  selector: 'app-followingand-followers',
  templateUrl: './followingand-followers.component.html',
  styleUrls: ['./followingand-followers.component.css']
})
export class FollowingandFollowersComponent implements OnInit {

  people: any[] = [];

  constructor(private clientsService: ClientsService,private alert:NotificationsService) {}

   @Input() active: boolean = false; // 🔴 <-- Needed to avoid binding error
    @Output() loaded = new EventEmitter<void>();
  
    ngOnInit(): void {
       if (this.active) {
       // this.getPendingFollowRequests();
      }
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['active'] && changes['active'].currentValue === true) {
       // this.getPendingFollowRequests();
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

  hoveredCode: string | null = null;

  onHover(code: string): void {
    this.hoveredCode = code;
    console.log('Hovered code:', code);
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

}




