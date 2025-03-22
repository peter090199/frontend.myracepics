
// import { Component } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';

// @Component({
//   selector: 'app-chat-website-pop-up',
//   templateUrl: './chat-website-pop-up.component.html',
//   styleUrls: ['./chat-website-pop-up.component.css']
// })
// export class ChatWebsitePopUPComponent {
//   users = [
//     { name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
//     { name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
//     { name: 'Michael Johnson', avatar: 'https://via.placeholder.com/40' },
//     { name: 'Emily Davis', avatar: 'https://via.placeholder.com/40' },
//     { name: 'David Martinez', avatar: 'https://via.placeholder.com/40' },
//     { name: 'Sophia Brown', avatar: 'https://via.placeholder.com/40' },
//     { name: 'Daniel Wilson', avatar: 'https://via.placeholder.com/40' },
//     { name: 'Olivia Taylor', avatar: 'https://via.placeholder.com/40' },
//     { name: 'William Anderson', avatar: 'https://via.placeholder.com/40' },
//     { name: 'Emma Thomas', avatar: 'https://via.placeholder.com/40' }
//   ];

//   constructor(public dialogRef: MatDialogRef<ChatWebsitePopUPComponent>) {}

//   closeChat() {
//     this.dialogRef.close();
//   }
// }

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-website-pop-up',
  templateUrl: './chat-website-pop-up.component.html',
  styleUrls: ['./chat-website-pop-up.component.css']
})
export class ChatWebsitePopUPComponent implements OnInit {
  users = [
    { name: 'Alice', avatar: 'https://via.placeholder.com/40' },
    { name: 'Bob', avatar: 'https://via.placeholder.com/40' },
    { name: 'Charlie', avatar: 'https://via.placeholder.com/40' }
  ];

  selectedUser: any = null;
  messages: { sender: string; text: string }[] = [];
  newMessage: string = '';

  constructor() {}

  ngOnInit(): void {
    // Load previous chat from localStorage
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
    }
  }

  openChatWith(user: any) {
    this.selectedUser = user;
    this.loadMessages();
  }

  sendMessage() {
    if (this.newMessage.trim() === '' || !this.selectedUser) return;

    this.messages.push({ sender: 'me', text: this.newMessage });
    this.saveMessages();
    this.newMessage = '';
  }

  saveMessages() {
    localStorage.setItem('chatHistory', JSON.stringify(this.messages));
  }

  loadMessages() {
    const savedMessages = localStorage.getItem(`chatHistory_${this.selectedUser.name}`);
    this.messages = savedMessages ? JSON.parse(savedMessages) : [];
  }

  closeChat() {
    this.selectedUser = null;
  }
}
