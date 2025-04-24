import { Component } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  messages = [
    { sender: 'Alice', text: 'Hey! How are you?', sentByMe: false },
    { sender: 'You', text: 'I’m good! What about you?', sentByMe: true },
    { sender: 'Alice', text: 'Great! Are you working on any new projects?', sentByMe: false },
  ];
  
  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ sender: 'You', text: this.newMessage, sentByMe: true });
      this.newMessage = '';
    }
  }

  contacts = [
    { name: 'Natalia Svintsova', message: 'Hi Pedro As a professional at your...', avatar: '' },
    { name: 'Jamie Elgie', message: 'Work with affordable developers that...', avatar: '' },
    { name: 'Daphne Baricuatro', message: 'Career Opportunity at...', avatar: '' },
    // Add more as needed
  ];

  selectedMessage = {
    name: 'Natalia Svintsova',
    title: 'eCommerce Marketing Manager at The Stepstone Group',
  };
}
