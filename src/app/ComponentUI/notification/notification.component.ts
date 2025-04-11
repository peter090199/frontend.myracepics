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
  isLoading:boolean = true;


  constructor(private notifyService: NotificationsService, private chatService: ChatService,
    private dialog: MatDialog,private echoService:EchoService,private authservice:AuthService
  ) {}

  ngOnInit(): void {
     this.loadNotifications();
  }

  unreadNotifications() {
    return this.notifications.filter(n => !n.is_read);
  }
  
  readNotifications() {
    return this.notifications.filter(n => n.is_read);
  }

  
  loadNotifications(): void {
    this.isLoading = true;
    this.chatService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = res.notifications;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
      }
    });
  }
  

  chatHistory: { [key: number]: any[] } = {};
  openChat(notif: any): void {
      this.updateReadStatus(notif.id); // ✅ Update backend
      
  }

  updateReadStatus(id: number): void {
    this.isLoading = true;
    this.chatService.markMessagesAsRead(id).subscribe({
      next: (res) => {
        this.totalUnreadMessages = this.notifications.length;
       // this.notifyService.toastrInfo(res.message);
        this.totalUnreadMessages--; 
        this.loadNotifications();
        this.isLoading = false;
      },
      error: (err) => console.error("❌ Error marking messages as read:", err),
    });
  }
  
  closeNotifications(): void {
    this.notifications = [];
  }
}
