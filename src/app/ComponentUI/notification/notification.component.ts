import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { ChatService } from 'src/app/services/chat.service';
import { ChatPopupComponent } from '../messages/chat-popup/chat-popup.component';
import { EchoService } from 'src/app/services/echo.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  totalUnreadMessages = 0;
  notificationCount = 0;

  constructor(private notifyService: NotificationsService, private chatService: ChatService,
    private dialog: MatDialog,private echoService:EchoService,private authservice:AuthService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();

    // this.echoService.listenToMessages((message: any) => {
    //   console.log('📩 New Message Received:', message);
    
    //   if (message && message.receiver_id === this.authservice.getData()) {
    //     // ✅ Increment unread messages count
    //     this.totalUnreadMessages++;
    
    //     // ✅ Add message to notifications list (only if unique)
    //     this.notifications.unshift(message);
    
    //     // ✅ Update the badge count dynamically
    //     this.notificationCount = this.notifications.length;
    //   }
    // });
    
    
  }

  loadNotifications(): void {
    this.chatService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = res;
        this.totalUnreadMessages = this.notifications.length;

        this.echoService.listenToMessages((notifications: any) => {
          console.log('📩 New Message Received:', notifications);
        
          if (notifications && notifications.receiver_id === this.authservice.getData()) {
            // ✅ Increment unread messages count
            this.totalUnreadMessages++;
        
            // ✅ Add message to notifications list (only if unique)
            this.notifications.unshift(notifications);
        
            // ✅ Update the badge count dynamically
            this.notificationCount = this.notifications.length;
          }
        });
      },
      error: (err) => console.error('❌ Error fetching notifications:', err),
    });
  }

  chatHistory: { [key: number]: any[] } = {};
  openChat(notif: any): void {
      this.updateReadStatus(notif.id); // ✅ Update backend
  
    // this.dialog.open(ChatPopupComponent, {
    //   width: '400px',
    //   data: { user: notif.sender, messages: this.chatHistory[notif.sender.id] || [] }
    // });
  }

  updateReadStatus(id: number): void {
    this.chatService.markMessagesAsRead(id).subscribe({
      next: (res) => {
        this.totalUnreadMessages = this.notifications.length;
        // this.notifyService.toastrInfo(res.message);
        this.totalUnreadMessages--; 
      },
      error: (err) => console.error("❌ Error marking messages as read:", err),
    });
  }
  
  closeNotifications(): void {
    this.notifications = [];
  }
}
