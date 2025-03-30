// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { ChatService } from 'src/app/services/chat.service';
// import { SearchService } from 'src/app/services/search.service';
// import { WebsocketService } from 'src/app/services/websocket.service';
// import { NotificationsService } from 'src/app/services/Global/notifications.service';
// import { PusherService } from 'src/app/services/pusher.service';
// import { AuthService } from 'src/app/services/auth.service';
// import Pusher from 'pusher-js';
// import { EchoService } from 'src/app/services/echo.service';

// @Component({
//   selector: 'app-chat-popup',
//   templateUrl: './chat-popup.component.html',
//   styleUrls: ['./chat-popup.component.css'],
//   template: `
//   <div *ngFor="let msg of messages">
//     <strong>{{ msg.sender_id === userId ? 'Me' : 'User ' + msg.sender_id }}:</strong>
//     {{ msg.message }}
//   </div>
//   <input [(ngModel)]="newMessage" placeholder="Type a message..." />
//   <button (click)="sendMessage()">Send</button>
// `,
// })
// export class ChatPopupComponent implements OnInit {
//   newMessage: string = '';
//   selectedUser: any = null;
//   users: any[] = [];
//   myUserId: number | null = null;
//   chatHistory: { [userId: number]: any[] } = {};
//   pusherClient: any;
//   showChatButton = true;
//   chatOpened = false;
  
//   messages: any[] = [];

//   @ViewChild('chatContainer') private chatContainer!: ElementRef;

//   constructor(
//     private chatService: ChatService,
//     private userService: SearchService,
//     private socket: WebsocketService,
//     private notify: NotificationsService,
//     private pusherService: PusherService,
//     private authService: AuthService,
//     private echoService: EchoService
//   ) {
//     this.loadUsers();
//   }

  
//   ngOnInit(): void {
//     this.authService.getData().subscribe({
//       next: (data) => {
//         this.myUserId = data?.id ?? null;
//         if (this.myUserId) {
//           this.initializePusher();
//           this.listenForNewMessages();
        
//           this.echoService.listenToMessages((message: any) => {
//             this.messages.push(message);
//           });
        
//         }

//       },
//       error: (err) => console.error('❌ Error fetching user data:', err)
//     });
//   }

//   closeChat(): void {
//     this.selectedUser = null;
//     this.chatOpened = false;
//     this.showChatButton = true;
//   }


//   initializePusher(): void {
//     if (!this.myUserId) return;

//     this.pusherClient = new Pusher('e0cd7653f3ae9bbbd459', {
//       cluster: 'ap1',
//     //  encrypted: true
//     });

//     const channel = this.pusherClient.subscribe(`my-channel-${this.myUserId}`);

//     // Listen for new messages
//     channel.bind('new-message', (data: any) => {
//       if (!data || !data.sender_id) return;

//       // If message is from the currently selected user, update the chat in real-time
//       if (this.selectedUser?.id === data.sender_id) {
//         this.chatHistory[this.selectedUser.id] = [
//           ...(this.chatHistory[this.selectedUser.id] || []),
//           data
//         ];
//         this.scrollToBottom();
//       }
//     });
//   }

//   loadUsers(): void {
//     this.chatService.getActiveMessages().subscribe({
//       next: (res) => this.users = res,
//       error: (err) => console.error('❌ Error fetching users', err)
//     });
//   }

//   openChatWith(user: any): void {
//     if (!user?.id) return;

//     this.selectedUser = user;
//     this.loadMessages(this.selectedUser.id);
//   }

//   loadMessages(receiverId: number): void {
//     this.chatService.getMessages(receiverId).subscribe({
//       next: (res) => {
//         this.chatHistory[receiverId] = res || [];
//         this.scrollToBottom();
//       },
//       error: (err) => console.error('❌ Error fetching messages:', err)
//     });
//   }

//   sendMessage(): void {
//     if (!this.newMessage.trim() || !this.selectedUser) return;

//     const receiverId = this.selectedUser.id;
//     const messageContent = this.newMessage;

//     // Optimistically update UI before sending
//     const newMessageObj = {
//       sender_id: this.myUserId,
//       receiver_id: receiverId,
//       message: messageContent,
//       created_at: new Date().toISOString()
//     };

//     if (!this.chatHistory[receiverId]) {
//       this.chatHistory[receiverId] = [];
//     }
//     this.chatHistory[receiverId].push(newMessageObj);
//     this.scrollToBottom();

//     this.newMessage = '';

//     this.chatService.sendMessage(receiverId, messageContent).subscribe({
//       next: () => console.log('✅ Message sent successfully'),
//       error: (err) => console.error('❌ Error sending message:', err)
//     });
//   }

//   listenForNewMessages(): void {
//     this.socket.receiveMessages().subscribe((newMessage) => {
//       if (!newMessage || !newMessage.receiver_id || !newMessage.sender_id) return;

//       if (newMessage.receiver_id === this.myUserId) {
//         if (!this.chatHistory[newMessage.sender_id]) {
//           this.chatHistory[newMessage.sender_id] = [];
//         }
//         this.chatHistory[newMessage.sender_id].push(newMessage);
//       }
//     });
//   }

//   scrollToBottom(): void {
//     setTimeout(() => {
//       if (this.chatContainer) {
//         this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
//       }
//     }, 100);
//   }
// }


import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { AuthService } from 'src/app/services/auth.service';
import { EchoService } from 'src/app/services/echo.service';
import { PusherService } from 'src/app/services/pusher.service';

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

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private notify: NotificationsService,
    private authService: AuthService,
    private echoService: EchoService,
    private pusherService: PusherService
  ) {}

  ngOnInit(): void {
    this.authService.getData().subscribe({
      next: (data) => {
        this.myUserId = data.id;

        if (this.myUserId) {
          console.log(`✅ User authenticated with ID: ${this.myUserId}`);
          this.listenForMessages();
        } else {
          console.warn('⚠️ User ID is null. Real-time messaging will not start.');
        }
      },
      error: (err) => {
        console.error('❌ Error fetching user data:', err);
      },
    });

    this.pusherService.listenToEvents((data) => {
      console.log('📩 Pusher Received:', data);
      this.notify.toastrSuccess(`New Message: ${data}`);
    });

    this.loadUsers();
  }

  listenForMessages(): void {
    this.echoService.listenToMessages((message: any) => {
      if (!message || !message.receiver_id || !message.sender_id) return;

      if (message.receiver_id === this.myUserId) {
        if (!this.selectedUser || this.selectedUser.id !== message.sender_id) {
          this.newMessageCounts[message.sender_id] = (this.newMessageCounts[message.sender_id] || 0) + 1;
        } else {
          if (!this.chatHistory[message.sender_id]) {
            this.chatHistory[message.sender_id] = [];
          }
          this.chatHistory[message.sender_id].push(message);
          this.scrollToBottom();
        }
        this.notify.toastrSuccess(`New message from ${message.sender_id}`);
      }
    });
  }

  onNotificationClick(id: number): void {
    const user = this.users.find(u => u.id === id);
    if (user) {
      this.openChatWith(user);
    }
  }

  openChatWith(user: any): void {
    if (!user?.id) return;
    this.selectedUser = user;
    this.newMessageCounts[user.id] = 0;
    this.loadMessages(user.id);
    this.listenForIncomingMessages(user.id);
  }

  listenForIncomingMessages(receiverId: number): void {
    this.echoService.listenToMessages((message: any) => {
      if (!message || !message.receiver_id || !message.sender_id) return;
      if (message.receiver_id === this.myUserId && message.sender_id === receiverId) {
        if (!this.chatHistory[receiverId]) {
          this.chatHistory[receiverId] = [];
        }
        this.chatHistory[receiverId].push(message);
        this.scrollToBottom();
      }
    });
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
  }

  get totalUnreadMessages(): number {
    return Object.values(this.newMessageCounts || {}).reduce((sum, count) => sum + count, 0);
  }
  
  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
