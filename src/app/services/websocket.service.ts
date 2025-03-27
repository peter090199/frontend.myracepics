import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private pusherClient: Pusher;
  private messageSubject = new BehaviorSubject<string>('');

 // constructor() {
    // this.pusherClient = new Pusher('e0cd7653f3ae9bbbd459', {
    //   cluster: 'ap1',
    //   wsHost: '127.0.0.1',
    //   wsPort: 6001,
    //   forceTLS: false,
    //   disableStats: true,
    //   enabledTransports: ['ws', 'wss'],

    // });

    // const channel = this.pusherClient.subscribe('private-chat');
    // channel.bind('MessageSent', (data: any) => {
    //   this.messageSubject.next(data.message);
    // });

    // same origin version

// cross origin version


  // getMessages() {
  //   return this.messageSubject.asObservable();
  // }

//  }

    private socket$: WebSocketSubject<any>;
  
    constructor(private http: HttpClient) {
      this.socket$ = webSocket('wss://ws-ap1.pusher.com/app/e0cd7653f3ae9bbbd459?protocol=7&client=js&version=8.4.0&flash=false');
     }

    receiveMessages(): Observable<any> {
      return this.socket$;
    }
  
}
