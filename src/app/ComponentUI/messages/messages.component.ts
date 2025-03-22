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
}
