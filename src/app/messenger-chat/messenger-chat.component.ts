import { Component, OnInit } from '@angular/core';
import Pusher from 'pusher-js';
import { NotificationsService } from '../services/Global/notifications.service';
import { EchoService } from '../services/echo.service';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../services/notification.service';
interface Message {
  text: string;
  sent: boolean;
  created_at?: string;
}

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
  myUserId: number | null = null;
  notificationCounts: { [key: string]: number } = {}; 

    constructor(private notifyService: NotificationsService, private chatService: ChatService,
      private dialog: MatDialog,private echoService:EchoService,private authservice:AuthService,
      private authService: AuthService,private notificationService: NotificationService
    ) {}
  
    
  ngOnInit(): void {
    this.loadNotifications();
    this.loadIsRead();
    this.loadData();
   // this.listenForIncomingMessages();

 }

//  listenForIncomingMessages(): void {
//   this.echoService.private(`chat.${this.myUserId}`)
//     .listen('MessageSent', (event: any) => {
//       console.log('📩 Incoming real-time message:', event);

//       if (!this.selectedUser) return;

//       if (event.sender_id === this.selectedUser.user_id) {
//         const incomingMessage: Message = {
//           text: event.message,
//           sent: false,
//           created_at: event.created_at || new Date().toISOString()
//         };
//         this.selectedUser.messages.push(incomingMessage);
//         this.scrollToBottom();
//       }
//     });
// }


 loadData(){
      this.authService.getData().subscribe({
      next: (data) => {
        this.myUserId = data.id;
        
        if (this.myUserId) {

        } else {
          console.warn('⚠️ User ID is null. Real-time messaging will not start.');
        }
      },
      error: (err) => {
        console.error('❌ Error fetching user data:', err);
      }
    });
  }



 openChatWith(notif: any): void {
  this.updateReadStatus(); 

  this.chatService.getMessages(notif.sender_id).subscribe({
    next: (res) => {
      this.selectedUser = {
        user_id: notif.sender_id,
        fullname: notif.fullname,
        photo_pic: notif.photo_pic,
        messages: res
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
  isSendDisabled: boolean = true;
  
  selectUser(user: any) {
    this.selectedUser = user;
  }
  onMessageChange() {
    this.isSendDisabled = !this.newMessage || !this.newMessage.trim();
  }

  sendMessage(): void {
    if (this.isSendDisabled || !this.newMessage.trim() || !this.selectedUser) return;
  
    const messageContent = this.newMessage.trim();
    const receiverId = this.selectedUser.user_id || this.selectedUser.sender_id;
  
    // Locally push the message for immediate UI feedback
    const newMessageObj = {
      sender_id: this.myUserId,
      message: messageContent,
      created_at: new Date().toISOString()
    };
  
    if (!this.selectedUser.messages) {
      this.selectedUser.messages = [];
    }
    this.selectedUser.messages.push(newMessageObj);
  
    this.scrollToBottom(); // Scroll down to the latest message
    
    // Clear the input field
    this.newMessage = '';
    this.isSendDisabled = true;
  
    // Actually send the message to the server
    this.chatService.sendMessage(receiverId, messageContent).subscribe({
      next: (response) => {
        console.log('✅ Message sent successfully:', response);
        
        // Optional: you can update the message with any extra server data if needed
        // For example: this.selectedUser.messages[this.selectedUser.messages.length - 1].id = response.messageId;
  
        // Refresh notification counts
        this.load();
  
      },
      error: (err) => {
        console.error('❌ Error sending message:', err);
        this.notifyService.toastrError('Failed to send message');
      }
    });
  
    // Optional: if you want, you could broadcast locally too for real-time feeling
  }
  

  
  load(){
    this.notificationService.notificationCounts$.subscribe(counts => {
      this.notificationCounts = counts;
      console.log(this.notificationCounts)
    });
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
    this.chatService.getIsRead().subscribe({
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
  openChat(): void {
      this.updateReadStatus(); // ✅ Update backend
      
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


  updateReadStatus(): void {
    this.isLoading = true;
    this.chatService.messagesIsread().subscribe({
      next: (res) => {
        this.totalUnreadMessages = this.notifications.length;
        //this.notifyService.toastrInfo(res.message);
        this.totalUnreadMessages--; 
        this.loadNotifications();
        this.loadIsRead();
        this.isLoading = false;
      },
      error: (err) => console.error("❌ Error marking messages as read:", err),
    });
  }
  
  closeNotifications(): void {
    this.notifications = [];
  }


}
