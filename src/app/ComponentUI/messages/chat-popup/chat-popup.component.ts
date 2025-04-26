import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { AuthService } from 'src/app/services/auth.service';
import { EchoService } from 'src/app/services/echo.service';
import { PusherService } from 'src/app/services/pusher.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.css'],
})
export class ChatPopupComponent implements OnInit {
  newMessage: string = '';
  selectedUser: any = null;
  myUserId: number | null = null;
  chatHistory: { [userId: number]: any[] } = {};
  showChatButton = true;
  chatOpened = false;
  users: any[] = [];
  messages: any[] = [];
  newMessageCounts: { [userId: number]: number } = {}; // Track unread messages per user
  @Input() receiverId!: number;

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  count = 0;
  notifications:any[]=[];
  notificationCounts: { [key: string]: number } = {}; 
  unreadCount = 0;

  constructor(
    private chatService: ChatService,
    private notify: NotificationsService,
    private authService: AuthService,
    private echoService: EchoService,
    private pusherService: PusherService,
    private notificationService: NotificationService
  ) {}

  userId:number = 0;

  ngOnInit(): void {
    this.echoService.listenToNotificationCount();
    this.echoService.notificationCount$.subscribe(count => {
      this.unreadCount = count;
    });
    this.loadData();
    this.loadUsers();
  }


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

  loadMessagesRealTime() {
    this.messages.push({
      text: '📩 New message received!',
     // timestamp: new Date(),
    });
    this.scrollToBottom();
  }

  onNotificationClick(id: number): void {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      this.openChatWith(user);
    }
  }

  openChatWith(user: any): void {
    if (!user?.id) return;
    this.selectedUser = user;
    this.newMessageCounts[user.id] = 0;
    this.loadMessages(user.id);
  }

  closeChat(): void {
    this.selectedUser = null;
    this.chatOpened = false;
    this.showChatButton = true;
  }

  loadUsers(): void {
    this.chatService.getActiveMessages().subscribe({
      next: (res) => (this.users = res),
      error: (err) => console.error('❌ Error fetching users', err),
    });
  }

  loadMessages(receiverId: number): void {
    this.chatService.getMessages(receiverId).subscribe({
      next: (res) => {
        this.chatHistory[receiverId] = res || [];
        this.scrollToBottom();
       // this.echoService.listenToMessages();
      },
      error: (err) => console.error('❌ Error fetching messages:', err),
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    const receiverId = this.selectedUser.id;
    const messageContent = this.newMessage;

    const newMessageObj = {
      sender_id: this.myUserId,
      receiver_id: receiverId,
      message: messageContent,
      created_at: new Date().toISOString(),
    };

    if (!this.chatHistory[receiverId]) {
      this.chatHistory[receiverId] = [];
    }
    this.chatHistory[receiverId].push(newMessageObj);
    this.scrollToBottom();

    this.newMessage = '';

    this.chatService.sendMessage(receiverId, messageContent).subscribe({
      next: () => console.log('✅ Message sent successfully'),
      error: (err) => {
        console.error('❌ Error sending message:', err);
        this.notify.toastrError('Failed to send message');
      },
    });
    
    this.load();
  }

  load(){
    this.notificationService.notificationCounts$.subscribe(counts => {
      this.notificationCounts = counts;
      console.log(this.notificationCounts)
    });


 }


  get totalUnreadMessages(): number {
    return Object.values(this.newMessageCounts || {}).reduce((sum, count) => sum + count, 0);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer?.nativeElement) {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
