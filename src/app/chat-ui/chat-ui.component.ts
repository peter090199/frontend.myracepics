import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../services/websocket.service';
import { PusherService } from '../services/pusher.service';

@Component({
  selector: 'app-chat-ui',
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.css']
})
export class ChatUIComponent implements OnInit {
  message: string = '';
  messages: { text: string; sender: 'self' | 'other' }[] = [];
  private apiUrl = 'http://127.0.0.1:8000/api/send-message';

  constructor(
    private websocketService: WebsocketService,
    private pusherService: PusherService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // console.log('✅ Waiting for Pusher events...');
    
    // this.pusherService.bindEvent('my-event', (data: any) => {
    //   console.log('✅ Event received:', data);
      
    //   if (data && data.message) {
    //     this.messages.push({ text: data.message, sender: 'other' }); // Display received messages
    //   }
    // });
  }

  sendMessage(): void {
    if (!this.message.trim()) return; // Prevent empty messages

    const messageData = { message: this.message };

    this.http.post(this.apiUrl, messageData).subscribe({
      next: (response) => {
        console.log('✅ Message sent:', response);
        this.messages.push({ text: this.message, sender: 'self' }); // Add to messages list
        this.message = ''; // Clear input after sending
      },
      error: (error) => console.error('❌ Error sending message:', error)
    });
  }
}
