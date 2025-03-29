import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PusherService } from '../services/pusher.service';

interface ChatMessage {
  text: string;
  sender: 'self' | 'other';
}

@Component({
  selector: 'app-chat-ui',
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.css']
})
export class ChatUIComponent implements OnInit, OnDestroy {
  message: string = '';
  messages: ChatMessage[] = [];
  receivedMessages: string[] = []; // Store received messages
  private apiUrl = 'http://127.0.0.1:8000/api/send-message';

  constructor(
    private http: HttpClient,
    private pusherService: PusherService
  ) {}

  ngOnInit(): void {
    console.log('✅ Listening for real-time messages...');

    // Listen for real-time messages from Pusher
    this.pusherService.bindEvent('my-event', (data: { message: string }) => {
      console.log('📩 New message received:', data);

      if (data?.message) {
        this.messages.push({ text: data.message, sender: 'other' });
        this.receivedMessages.push(data.message); // Update UI with new message
      }
    });
  }

  sendMessage(): void {
    if (!this.message.trim()) return; // Prevent empty messages

    const messageData = { message: this.message };

    this.http.post(this.apiUrl, messageData).subscribe({
      next: (response) => {
        console.log('✅ Message sent:', response);
        this.messages.push({ text: this.message, sender: 'self' });
        this.message = ''; // Clear input after sending
      },
      error: (error) => console.error('❌ Error sending message:', error)
    });
  }

  ngOnDestroy(): void {
    // Unbind event when component is destroyed
   // this.pusherService.unbindEvent('my-event');
    console.log('❌ Pusher event unbound.');
  }
}
