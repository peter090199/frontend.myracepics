// import { Component } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';

// @Component({
//   selector: 'app-chat-popup',
//   templateUrl: './chat-popup.component.html',
//   styleUrls: ['./chat-popup.component.css']
// })
// export class ChatPopupComponent {
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

//   constructor(public dialogRef: MatDialogRef<ChatPopupComponent>) {}

//   closeChat() {
//     this.dialogRef.close();
//   }
// }
import { Component,OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.css']
})
export class ChatPopupComponent implements OnInit {
  users = [
            { name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
            { name: 'Jane Smith', avatar: 'https://via.placeholder.com/40' },
            { name: 'Michael Johnson', avatar: 'https://via.placeholder.com/40' },
            { name: 'Emily Davis', avatar: 'https://via.placeholder.com/40' },
            { name: 'David Martinez', avatar: 'https://via.placeholder.com/40' },
            { name: 'Sophia Brown', avatar: 'https://via.placeholder.com/40' },
            { name: 'Daniel Wilson', avatar: 'https://via.placeholder.com/40' },
            { name: 'Olivia Taylor', avatar: 'https://via.placeholder.com/40' },
            { name: 'William Anderson', avatar: 'https://via.placeholder.com/40' },
            { name: 'Emma Thomas', avatar: 'https://via.placeholder.com/40' }
  ];

  selectedUser: any = null;
  chatHistory: { [userId: number]: any[] } = {}; // Store messages per user
  newMessage = '';
  showChatButton = true;
  chatOpened = false;
  
  openChat() {
    this.chatOpened = true;
    this.showChatButton = false; // Hide floating button when chat is open
  }

  ngOnInit() {
    this.loadChatHistory();
  }

  
  loadChatHistory() {
    const storedChats = localStorage.getItem('chatHistory');
    if (storedChats) {
      this.chatHistory = JSON.parse(storedChats);
    }
  }


    // Save chat history to LocalStorage
    saveChatHistory() {
      localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory));
    }

  openChatWith(user: any) {
    this.selectedUser = user;
    
    // Load chat history if exists, else initialize
    if (!this.chatHistory[user.id]) {
      this.chatHistory[user.id] = [
        { text: 'Hello!', sender: 'me' },
        { text: 'Hi, how are you?', sender: user.name }
      ];
    }
    this.saveChatHistory();
  }
  sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      const userId = this.selectedUser.id;
      
      this.chatHistory[userId].push({ text: this.newMessage, sender: 'me' });
      this.saveChatHistory(); // Save after message is sent
      this.newMessage = '';

      // Simulated reply after 1 second
      setTimeout(() => {
        this.chatHistory[userId].push({ text: 'Got it!', sender: this.selectedUser.name });
        this.saveChatHistory(); // Save after reply
      }, 1000);
    }
  }

  closeChat() {
    this.selectedUser = null; // Go back to user list
    this.chatOpened = false;
    this.showChatButton = true;
  }

  clearChatHistory() {
    localStorage.removeItem('chatHistory');
    this.chatHistory = {}; // Clear in-memory storage too
  }
}
