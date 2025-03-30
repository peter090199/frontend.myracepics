import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class EchoService {
  private echo: Echo<any>;

  constructor() {
    (window as any).Pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'e0cd7653f3ae9bbbd459',  // Replace with your Pusher Key
      cluster: 'ap1',  // Match your Pusher region
      forceTLS: true,
    });

    // ✅ Debug Connection Status
    this.echo.connector.pusher.connection.bind('connected', () => {
      console.log('✅ Laravel Echo Connected!');
    });

    this.echo.connector.pusher.connection.bind('error', (err: any) => {
      console.error('❌ Pusher Connection Error:', err);
    });


    
  }

 
  listenToMessagesxx(callback: (message: any) => void) {
    this.echo.channel('chat').listen('MessageSent', (data: any) => {
      console.log('📩 Message Received:', data.message);
      callback(data.message);
    });
  }

  listenToMessages(callback: (message: any) => void) {
    this.echo.channel('chat').listen('.message.sent', (data: any) => {
      console.log('📩 Received message:', data);
      callback(data.message);
    });
  }


}
