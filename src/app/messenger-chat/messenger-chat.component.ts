import { Component } from '@angular/core';
import Pusher from 'pusher-js';

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
export class MessengerChatComponent {
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
}
