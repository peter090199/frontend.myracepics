// import { Component, OnInit } from '@angular/core';
// import { ChatService } from 'src/app/services/chat.service';

// @Component({
//   selector: 'app-chat-popup',
//   templateUrl: './chat-popup.component.html',
//   styleUrls: ['./chat-popup.component.css']
// })
// export class ChatPopupComponent implements OnInit {
//   messages: any[] = [];
//   newMessage: string = '';
//   selectedUser: any = null;
//   users = [
//     { id: 91, name: 'Pedro Yorpo', avatar: 'https://via.placeholder.com/40' },
//     { id: 93, name: 'Michael Johnson', avatar: 'https://via.placeholder.com/40' },
//     { id: 102, name: 'renJun', avatar: 'https://via.placeholder.com/40' }
//   ];

//   chatHistory: { [userId: number]: any[] } = {}; // Store messages per user
//   showChatButton = true;
//   chatOpened = false;

//   constructor(private chatService: ChatService) {}

//   ngOnInit() {
//     this.loadChatHistory();
//   }

//   openChatWith(user: any) {
//     this.selectedUser = user;

//     if (this.chatHistory[user.id]) {
//       this.messages = this.chatHistory[user.id];
//     } else {
//       this.loadMessages(user.id);
//     }
//   }

//   loadMessages(receiverId: number) {
//     this.chatService.getMessages(receiverId).subscribe({
//       next: (res) => {
//         this.chatHistory[receiverId] = res; // Store messages in chat history
//         this.messages = this.chatHistory[receiverId]; // Display messages
//         this.saveChatHistory(); // Save to local storage
//       },
//       error: (err) => console.error('Error fetching messages', err)
//     });
//   }

//   sendMessage() {
//     if (!this.newMessage.trim() || !this.selectedUser) return;

//     this.chatService.sendMessage(this.selectedUser.id, this.newMessage).subscribe({
//       next: (res) => {
//         const newMsg = res.message;
//         this.messages.push(newMsg); // Add to current chat
//         if (!this.chatHistory[this.selectedUser.id]) {
//           this.chatHistory[this.selectedUser.id] = [];
//         }
//         this.chatHistory[this.selectedUser.id].push(newMsg); // Store in history
//         this.saveChatHistory();
//         this.newMessage = ''; 
//       },
//       error: (err) => console.error('Error sending message', err)
//     });
//   }

//   openChat() {
//     this.chatOpened = true;
//     this.showChatButton = false;
//   }

//   closeChat() {
//     this.selectedUser = null;
//     this.chatOpened = false;
//     this.showChatButton = true;
//   }

//   // Save chat history to LocalStorage
//   saveChatHistory() {
//     localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
//   }

//   // Load chat history from LocalStorage
//   loadChatHistory() {
//     const storedChats = localStorage.getItem('chatHistory');
//     if (storedChats) {
//       this.chatHistory = JSON.parse(storedChats);
//     }
//   }

//   // Clear chat history
//   clearChatHistory() {
//     localStorage.removeItem('chatHistory');
//     this.chatHistory = {}; // Clear memory storage too
//   }
// }


import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { SearchService } from 'src/app/services/search.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import Pusher from 'pusher-js';
import { PusherService } from 'src/app/services/pusher.service';


@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.css']
})
export class ChatPopupComponent implements OnInit,AfterViewChecked  {
  newMessage: string = '';
  selectedUser: any = null;
  users: any = [];

  // users = [
  //   { id: 91, name: 'Pedro Yorpo', avatar: 'https://via.placeholder.com/40' },
  //   { id: 93, name: 'Michael Johnson', avatar: 'https://via.placeholder.com/40' },
  //   { id: 102, name: 'renJun', avatar: 'https://via.placeholder.com/40' },
  // ];
  
  chatHistory: { [userId: number]: any[] } = {}; // Stores messages dynamically per user
  showChatButton = true;
  chatOpened = false;
  onlineUsers:any=[];
  offlineUsers:any=[];
  searchQuery: string = '';
  myUserId:number = 92;

  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  pusherClient: any;
  messages: { text: string; sender: 'self' | 'other' }[] = [];


  constructor(private chatService: ChatService, private userService: SearchService,private socket:WebsocketService,
              private notify:NotificationsService,
              private pusherService:PusherService
  ) {}

  ngOnInit(): void { 
     this.pusherClient = new Pusher('e0cd7653f3ae9bbbd459', {
      cluster: 'ap1'
    });

    const channel = this.pusherClient.subscribe(`my-channel-${this.myUserId}`);
    channel.bind('new-message', (data: any) => {
      if (this.selectedUser && data.sender_id === this.selectedUser.id) {
        this.chatHistory[this.selectedUser.id].push(data);
      }
    });

       this.pusherService.bindEvent('my-event', (data: any) => {
      console.log('✅ Event received:', data);
      
      if (data && data.message) {
        this.messages.push({ text: data.message, sender: 'other' }); // Display received messages
      }
    });

    this.listenForNewMessages();
    this.loadUsers();
  }


  ngAfterViewChecked() {
   // this.scrollToBottom();
  }

  loadUsers() {
    this.chatService.getActiveMessages().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => console.error('Error fetching users', err)
    });
  }


  
  openChatWith(user: any) {
    this.selectedUser = user;
    this.loadMessages(user.id);
  }

  loadMessages(receiverId: number) {
    this.chatService.getMessages(receiverId).subscribe({
      next: (res) => {
        this.chatHistory[receiverId] = res; // Store messages for each user dynamically
      },
      error: (err) => console.error('Error fetching messages', err)
    });
  }

  // sendMessage() {
  //   if (!this.newMessage.trim()) return;
    
  //   this.chatHistory[this.selectedUser.id].push({ sender_id: this.myUserId, message: this.newMessage });
  //   this.newMessage = '';
  // }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedUser) return;

    this.chatService.sendMessage(this.selectedUser.id, this.newMessage).subscribe({
      next: (res) => {
        if (!this.chatHistory[this.selectedUser.id]) {
          this.chatHistory[this.selectedUser.id] = []; // Initialize array if empty
        }

        this.notify.toastrSuccess(res.message);
        this.chatHistory[this.selectedUser.id].push(res.message); // Append new message
        this.newMessage = ''; // Clear input field
      },
      error: (err) => console.error('Error sending message', err)
    });
  }

  openChat() {
    this.chatOpened = true;
    this.showChatButton = false;
    
  }

  closeChat() {
    this.selectedUser = null;
    this.chatOpened = false;
    this.showChatButton = true;
  }


  fetchUsers(): void {
    const query = this.searchQuery?.trim();
    if (!query) {
      console.warn('Search query is empty.');
      return;
    }

    this.userService.searchUsers(query).subscribe({
      next: (response) => {
  
        if (response && typeof response === 'object' && 'online' in response && 'offline' in response) {
          this.onlineUsers = Array.isArray(response.online) ? response.online : [];
          this.offlineUsers = Array.isArray(response.offline) ? response.offline : [];
  
          console.log(`🔹 Found ${this.onlineUsers.length} online users`);
          console.log(`🔹 Found ${this.offlineUsers.length} offline users`);
        } else {
          console.error('⚠️ Unexpected API response format:', response);
          this.onlineUsers = [];
          this.offlineUsers = [];
        }
      },
      error: (error) => {
        console.error('❌ Error fetching users:', error);
        this.onlineUsers = [];
        this.offlineUsers = [];
      }
    });
  }
  

  listenForNewMessages() {
    this.socket.receiveMessages().subscribe((newMessage) => {
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
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

}
