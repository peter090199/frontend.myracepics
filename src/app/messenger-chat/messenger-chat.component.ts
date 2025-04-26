import { Component, OnInit } from '@angular/core';
import Pusher from 'pusher-js';
import { NotificationsService } from '../services/Global/notifications.service';
import { EchoService } from '../services/echo.service';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';

interface User {
  name: string;
  photo: string;
  lastMessage: string;
  messages: { text: string; sent: boolean }[];
}

@Component({
  selector: 'app-messenger-chat',
  templateUrl: './messenger-chat.component.html',
  styleUrls: ['./messenger-chat.component.css']
})
export class MessengerChatComponent  implements OnInit{

  notifications: any[] = [];
  isRead: any[] = [];
  totalUnreadMessages = 0;
  notificationCount = 0;
  isLoading:boolean = true;

    constructor(private notifyService: NotificationsService, private chatService: ChatService,
      private dialog: MatDialog,private echoService:EchoService,private authservice:AuthService
    ) {}
  
    
  ngOnInit(): void {
    this.loadNotifications();
    this.loadIsRead();
 }



 openChatWith(notif: any): void {
  this.updateReadStatus(notif.id); 
  this.chatService.getMessages(notif.sender_id).subscribe({
    next: (res) => {
      this.selectedUser = {
        fullname: notif.fullname,
        photo_pic: notif.photo_pic,
        messages: res // [{message, created_at}]
      };
     // this.isLoading = false;
      setTimeout(() => this.scrollToBottom(), 100); // Auto scroll
    },
    error: (err) => {
      console.error('❌ Error fetching messages:', err);
  //    this.isLoading = false;
    }
  });
}

scrollToBottom() {
  const container = document.querySelector('.chat-messages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

  users = [
    {
      name: 'John Doe',
      photo: '',
      lastMessage: 'See you tomorrow!',
      messages: [
        { text: 'Hi there!', sent: false },
        { text: 'Hello!', sent: true }
      ]
    },
    {
      name: 'Jane Smith',
      photo: '',
      lastMessage: 'Great work!',
      messages: [
        { text: 'Nice job on the project.', sent: false },
        { text: 'Thanks a lot!', sent: true }
      ]
    }
  ];

  selectedUser: any = null;
  newMessage: string = '';

  selectUser(user: any) {
    this.selectedUser = user;
  }

  // sendMessage() {
  //   if (this.newMessage.trim() && this.selectedUser) {
  //     this.selectedUser.messages.push({ text: this.newMessage, sent: true });
  //     this.newMessage = '';
  //   }
  // }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.selectedUser.messages.push({
        text: this.newMessage,
        sent: true
      });
      this.newMessage = '';
    }
  }

  panelOpenState = false;
  unreadNotifications() {
    return this.notifications.filter(n => !n.is_read);
  }
  
  readNotifications() {
    return this.isRead.filter(n => n.is_read);
  
  }

  loadIsRead(): void {
   // this.isLoading = true;
    this.chatService.getIsReadMessages().subscribe({
      next: (res) => {
        this.isRead = res.notifications;
      //  this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading messages:', err);
      }
    });
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.chatService.getMessagesReceive().subscribe({
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
  markAllAsRead(): void {
    this.isLoading = true;
    this.chatService.markMessagesAllRead().subscribe({
      next: (res) => {
        this.notifyService.toastrInfo(res.message);
        this.isLoading = false;
        this.loadNotifications();
        this.loadIsRead();
      },
      error: (error) => {
        console.error('Error marking messages as read', error);
      }
    });
  }


  markAllAsReadxx() {
   // this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.isLoading = true;
    this.chatService.markMessagesAllRead().subscribe({
      next: (res) => {
        this.notifyService.toastrInfo(res.message);
        this.loadNotifications();
        this.loadIsRead();
        this.isLoading = false;
      },
      error: (err) => console.error("❌ Error marking messages as read:", err),
    });
  }

  updateReadStatus(id: number): void {
   // this.isLoading = true;
    this.chatService.markMessagesAsRead(id).subscribe({
      next: (res) => {
        this.totalUnreadMessages = this.notifications.length;
       // this.notifyService.toastrInfo(res.message);
        this.totalUnreadMessages--; 
        this.loadNotifications();
        this.loadIsRead();
      //  this.isLoading = false;
      },
      error: (err) => console.error("❌ Error marking messages as read:", err),
    });
  }
  
  closeNotifications(): void {
    this.notifications = [];
  }


}
