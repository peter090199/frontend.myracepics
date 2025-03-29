// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { ChatService } from 'src/app/services/chat.service';
// import { SearchService } from 'src/app/services/search.service';
// import { WebsocketService } from 'src/app/services/websocket.service';
// import { NotificationsService } from 'src/app/services/Global/notifications.service';
// import Pusher from 'pusher-js';
// import { PusherService } from 'src/app/services/pusher.service';
// import { AuthService } from 'src/app/services/auth.service';

// @Component({
//   selector: 'app-chat-popup',
//   templateUrl: './chat-popup.component.html',
//   styleUrls: ['./chat-popup.component.css']
// })
// export class ChatPopupComponent implements OnInit {
//   newMessage: string = '';
//   selectedUser: any = null;
//   users: any = [];
//   myUserId: any;
  
//   chatHistory: { [userId: number]: any[] } = {}; // Stores messages per user
//   showChatButton = true;
//   chatOpened = false;
//   onlineUsers: any[] = [];
//   offlineUsers: any[] = [];
//   searchQuery: string = '';

//   @ViewChild('chatContainer') private chatContainer!: ElementRef;
//   pusherClient: any;
//   messages: { text: string; sender: 'self' | 'other' }[] = [];

//   constructor(
//     private chatService: ChatService,
//     private userService: SearchService,
//     private socket: WebsocketService,
//     private notify: NotificationsService,
//     private pusherService: PusherService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.authService.getData().subscribe({
//       next: (data) => {
//         this.myUserId = data?.id ?? null;
//         console.log('📌 Logged-in User ID:', this.myUserId);
//       },
//       error: (err) => console.error('❌ Error fetching user data:', err)
//     });
    

//     this.initializePusher();
//     this.listenForNewMessages();
//     this.loadUsers();
//   }

//   initializePusher(): void {
//     this.pusherClient = new Pusher('e0cd7653f3ae9bbbd459', {
//       cluster: 'ap1'
//     });

//     const channel = this.pusherClient.subscribe(`my-channel-${this.myUserId}`);
    
//     channel.bind('new-message', (data: any) => {
//       if (!data || !data.sender_id) return;

//       if (this.selectedUser && data.sender_id === this.selectedUser.id) {
//         if (!this.chatHistory[this.selectedUser.id]) {
//           this.chatHistory[this.selectedUser.id] = [];
//         }
//         this.chatHistory[this.selectedUser.id].push(data);
//       }
//     });

//     this.pusherService.bindEvent('my-event', (data: any) => {
//       console.log('✅ Event received:', data);
//       if (data && data.message) {
//         this.messages.push({ text: data.message, sender: 'other' });
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
//     if (!user || !user.id) {
//       console.error('⚠️ Invalid user selected:', user);
//       return;
//     }

//     this.selectedUser = user;
//     console.log('💬 Chatting with User ID:', this.selectedUser.id);
//     this.loadMessages(this.selectedUser.id);
//   }

//   loadMessages(receiverId: number): void {
//     this.chatService.getMessages(receiverId).subscribe({
//       next: (res) => {
//         this.chatHistory[receiverId] = res || [];
//       },
//       error: (err) => console.error('❌ Error fetching messages:', err)
//     });
//   }

//   sendMessage(): void {
//     if (!this.newMessage.trim() || !this.selectedUser) return;

//     const receiverId = this.selectedUser.id;

//     this.chatService.sendMessage(receiverId, this.newMessage).subscribe({
//       next: (res) => {
//         if (!this.chatHistory[receiverId]) {
//           this.chatHistory[receiverId] = [];
//         }
//         this.chatHistory[receiverId].push(res.message);
//         this.newMessage = '';
//       },
//       error: (err) => console.error('❌ Error sending message:', err)
//     });
//   }

//   openChat(): void {
//     this.chatOpened = true;
//     this.showChatButton = false;
//   }

//   closeChat(): void {
//     this.selectedUser = null;
//     this.chatOpened = false;
//     this.showChatButton = true;
//   }

//   fetchUsers(): void {
//     const query = this.searchQuery.trim();
//     if (!query) {
//       console.warn('🔍 Search query is empty.');
//       return;
//     }

//     this.userService.searchUsers(query).subscribe({
//       next: (response) => {
//         if (response && response.online && response.offline) {
//           this.onlineUsers = Array.isArray(response.online) ? response.online : [];
//           this.offlineUsers = Array.isArray(response.offline) ? response.offline : [];
//           console.log(`🔹 Found ${this.onlineUsers.length} online users`);
//           console.log(`🔹 Found ${this.offlineUsers.length} offline users`);
//         } else {
//           console.error('⚠️ Unexpected API response format:', response);
//         }
//       },
//       error: (error) => console.error('❌ Error fetching users:', error)
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
// }



// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { ChatService } from 'src/app/services/chat.service';
// import { SearchService } from 'src/app/services/search.service';
// import { WebsocketService } from 'src/app/services/websocket.service';
// import { NotificationsService } from 'src/app/services/Global/notifications.service';
// import { PusherService } from 'src/app/services/pusher.service';
// import { AuthService } from 'src/app/services/auth.service';
// import Pusher from 'pusher-js';

// @Component({
//   selector: 'app-chat-popup',
//   templateUrl: './chat-popup.component.html',
//   styleUrls: ['./chat-popup.component.css']
// })
// export class ChatPopupComponent implements OnInit {
//   newMessage: string = '';
//   selectedUser: any = null;
//   users: any[] = [];
//   myUserId: number | null = null;

//   chatHistory: { [userId: number]: any[] } = {}; // Stores messages per user
//   showChatButton = true;
//   chatOpened = false;
//   onlineUsers: any[] = [];
//   offlineUsers: any[] = [];
//   searchQuery: string = '';

//   @ViewChild('chatContainer') private chatContainer!: ElementRef;
//   pusherClient: any;
//   messages: { text: string; sender: 'self' | 'other' }[] = [];

//   constructor(
//     private chatService: ChatService,
//     private userService: SearchService,
//     private socket: WebsocketService,
//     private notify: NotificationsService,
//     private pusherService: PusherService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.authService.getData().subscribe({
//       next: (data) => {
//         this.myUserId = data?.id ?? null;
//         console.log('📌 Logged-in User ID:', this.myUserId);

//         if (this.myUserId) {
//           this.initializePusher();
//           this.listenForNewMessages();
//           this.loadUsers();
//         }
//       },
//       error: (err) => console.error('❌ Error fetching user data:', err)
//     });
//   }

//   initializePusher(): void {
//     if (!this.myUserId) return;

//     this.pusherClient = new Pusher('e0cd7653f3ae9bbbd459', {
//       cluster: 'ap1',
//       //encrypted: true
//     });

//     const channel = this.pusherClient.subscribe(`my-channel-${this.myUserId}`);

//     channel.bind('new-message', (data: any) => {
//       if (!data || !data.sender_id) return;

//       if (this.selectedUser && data.sender_id === this.selectedUser.id) {
//         if (!this.chatHistory[this.selectedUser.id]) {
//           this.chatHistory[this.selectedUser.id] = [];
//         }
//         this.chatHistory[this.selectedUser.id].push(data);
//       } else {
//         console.log('🔔 New message from another user:', data);
//       }
//     });

//     this.pusherService.bindEvent('my-event', (data: any) => {
//       console.log('✅ Event received:', data);
//       if (data?.message) {
//         this.messages.push({ text: data.message, sender: 'other' });
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
//     if (!user?.id) {
//       console.error('⚠️ Invalid user selected:', user);
//       return;
//     }

//     this.selectedUser = user;
//     console.log('💬 Chatting with User ID:', this.selectedUser.id);
//     this.loadMessages(this.selectedUser.id);
//   }

//   loadMessages(receiverId: number): void {
//     this.chatService.getMessages(receiverId).subscribe({
//       next: (res) => {
//         this.chatHistory[receiverId] = res || [];
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

//     this.newMessage = '';

//     this.chatService.sendMessage(receiverId, messageContent).subscribe({
//       next: (res) => {
//         console.log('✅ Message sent successfully:', res);
//       },
//       error: (err) => console.error('❌ Error sending message:', err)
//     });
//   }

//   openChat(): void {
//     this.chatOpened = true;
//     this.showChatButton = false;
//   }

//   closeChat(): void {
//     this.selectedUser = null;
//     this.chatOpened = false;
//     this.showChatButton = true;
//   }

//   fetchUsers(): void {
//     const query = this.searchQuery.trim();
//     if (!query) {
//       console.warn('🔍 Search query is empty.');
//       return;
//     }

//     this.userService.searchUsers(query).subscribe({
//       next: (response) => {
//         if (response?.online && response?.offline) {
//           this.onlineUsers = Array.isArray(response.online) ? response.online : [];
//           this.offlineUsers = Array.isArray(response.offline) ? response.offline : [];
//           console.log(`🔹 Found ${this.onlineUsers.length} online users`);
//           console.log(`🔹 Found ${this.offlineUsers.length} offline users`);
//         } else {
//           console.error('⚠️ Unexpected API response format:', response);
//         }
//       },
//       error: (error) => console.error('❌ Error fetching users:', error)
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
// }

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { SearchService } from 'src/app/services/search.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { PusherService } from 'src/app/services/pusher.service';
import { AuthService } from 'src/app/services/auth.service';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.css']
})
export class ChatPopupComponent implements OnInit {
  newMessage: string = '';
  selectedUser: any = null;
  users: any[] = [];
  myUserId: number | null = null;
  chatHistory: { [userId: number]: any[] } = {};
  pusherClient: any;
  showChatButton = true;
  chatOpened = false;
  
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor(
    private chatService: ChatService,
    private userService: SearchService,
    private socket: WebsocketService,
    private notify: NotificationsService,
    private pusherService: PusherService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getData().subscribe({
      next: (data) => {
        this.myUserId = data?.id ?? null;
        if (this.myUserId) {
          this.initializePusher();
          this.listenForNewMessages();
          this.loadUsers();
        }
      },
      error: (err) => console.error('❌ Error fetching user data:', err)
    });
  }

  closeChat(): void {
    this.selectedUser = null;
    this.chatOpened = false;
    this.showChatButton = true;
  }


  initializePusher(): void {
    if (!this.myUserId) return;

    this.pusherClient = new Pusher('e0cd7653f3ae9bbbd459', {
      cluster: 'ap1',
    //  encrypted: true
    });

    const channel = this.pusherClient.subscribe(`my-channel-${this.myUserId}`);

    // Listen for new messages
    channel.bind('new-message', (data: any) => {
      if (!data || !data.sender_id) return;

      // If message is from the currently selected user, update the chat in real-time
      if (this.selectedUser?.id === data.sender_id) {
        this.chatHistory[this.selectedUser.id] = [
          ...(this.chatHistory[this.selectedUser.id] || []),
          data
        ];
        this.scrollToBottom();
      }
    });
  }

  loadUsers(): void {
    this.chatService.getActiveMessages().subscribe({
      next: (res) => this.users = res,
      error: (err) => console.error('❌ Error fetching users', err)
    });
  }

  openChatWith(user: any): void {
    if (!user?.id) return;

    this.selectedUser = user;
    this.loadMessages(this.selectedUser.id);
  }

  loadMessages(receiverId: number): void {
    this.chatService.getMessages(receiverId).subscribe({
      next: (res) => {
        this.chatHistory[receiverId] = res || [];
        this.scrollToBottom();
      },
      error: (err) => console.error('❌ Error fetching messages:', err)
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    const receiverId = this.selectedUser.id;
    const messageContent = this.newMessage;

    // Optimistically update UI before sending
    const newMessageObj = {
      sender_id: this.myUserId,
      receiver_id: receiverId,
      message: messageContent,
      created_at: new Date().toISOString()
    };

    if (!this.chatHistory[receiverId]) {
      this.chatHistory[receiverId] = [];
    }
    this.chatHistory[receiverId].push(newMessageObj);
    this.scrollToBottom();

    this.newMessage = '';

    this.chatService.sendMessage(receiverId, messageContent).subscribe({
      next: () => console.log('✅ Message sent successfully'),
      error: (err) => console.error('❌ Error sending message:', err)
    });
  }

  listenForNewMessages(): void {
    this.socket.receiveMessages().subscribe((newMessage) => {
      if (!newMessage || !newMessage.receiver_id || !newMessage.sender_id) return;

      if (newMessage.receiver_id === this.myUserId) {
        if (!this.chatHistory[newMessage.sender_id]) {
          this.chatHistory[newMessage.sender_id] = [];
        }
        this.chatHistory[newMessage.sender_id].push(newMessage);
        this.scrollToBottom();
      }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
