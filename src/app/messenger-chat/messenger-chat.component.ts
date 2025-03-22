import { Component } from '@angular/core';

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
  users: User[] = [
    {
      name: 'Alice',
      photo: 'assets/images/user1.png',
      lastMessage: 'Hey there!',
      messages: [
        { text: 'Hey, how are you?', sent: false },
        { text: 'I am good, thanks!', sent: true }
      ]
    },
    {
      name: 'Bob',
      photo: 'assets/images/user2.png',
      lastMessage: 'Meeting at 3PM?',
      messages: [
        { text: 'Meeting at 3PM?', sent: false },
        { text: 'Yes, confirmed.', sent: true }
      ]
    }
  ];

  selectedUser: User | null = null;
  newMessage: string = '';

  selectUser(user: User) {
    this.selectedUser = user;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      this.selectedUser.messages.push({ text: this.newMessage, sent: true });
      this.newMessage = '';
    }
  }
}
