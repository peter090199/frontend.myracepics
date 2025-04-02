import { Injectable } from '@angular/core';
import Pusher, { Channel } from 'pusher-js'; // ✅ Import Pusher and Channel type correctly

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  private pusher: Pusher;
  private channel: Channel; // ✅ Use Channel type directly

  constructor() {
    this.pusher = new Pusher('e0cd7653f3ae9bbbd459', { // ✅ Replace with your Pusher key
      cluster: 'ap1'
    });

    this.channel = this.pusher.subscribe('my-channel'); // ✅ Subscribe to a channel
  }

  bindEvent(eventName: string, callback: (data: any) => void) {
    this.channel.bind(eventName, callback);
  }

  
  listenToEvents(callback: (data: any) => void) {
    this.channel.bind('my-event', (data: any) => {
      console.log('📩 Event Received:', data);
      callback(data);
    });
  }

  listenForNotifications(callback: (data: any) => void) {
    this.channel.bind('my-event', (data: any) => {
      console.log('📩 Event Received:', data);
      callback(data);
    });
  }


}
