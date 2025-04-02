import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private pusher: Pusher;
  private channel: any;
  private unreadCount = new BehaviorSubject<number>(0);

  unreadCount$ = this.unreadCount.asObservable();

  constructor() {
    this.pusher = new Pusher('e0cd7653f3ae9bbbd459', {
      cluster: 'ap1',
    });

    this.channel = this.pusher.subscribe('chat');

    this.channel.bind('.message.sent', (data: any) => {
      this.incrementUnreadCount();
    });
  }

  private incrementUnreadCount() {
    this.unreadCount.next(this.unreadCount.value + 1);
  }

  
  resetUnreadCount() {
    this.unreadCount.next(0);
  }
}
