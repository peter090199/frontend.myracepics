import { Component,OnInit  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { MessengerChatComponent } from './messenger-chat/messenger-chat.component';
import { MatDialog } from '@angular/material/dialog';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChatPopupComponent } from './ComponentUI/messages/chat-popup/chat-popup.component';
import { ChatWebsitePopUPComponent } from './ComponentUI/messages/chat-website-pop-up/chat-website-pop-up.component';
import { PusherService } from './services/pusher.service';
import { AuthService } from './services/auth.service';
import { EchoService } from './services/echo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],

})
export class AppComponent implements OnInit {

  isLoggedIn: boolean = false; // Track login status
  showChatButton: boolean = true; // Default visibility
  showWebsiteChat: boolean = true; // Default visibility
  message: string = '';
  userId: number | null = null;
  
  constructor(private translate: TranslateService,public dialog: MatDialog,private pusherService: PusherService,
    private cookieService: CookieService,private authService: AuthService,private echoService:EchoService
  ) {
    translate.addLangs(['en', 'fr']); // Add other languages as needed
    translate.setDefaultLang('en');   // Set the default language
  }
  
  ngOnInit(): void {
    // this.echoService.listenToMessages((message) => {
    //   console.log('📩 New Message Received:', message);
    // });

    // this.pusherService.bindEvent('my-event', (data: any) => {
    //   this.message = data.message;
    // });


    this.cookieService.set('myCookie', 'cookieValue', { expires: 7, path: '/' });
    // Get a cookie
    const myCookieValue = this.cookieService.get('myCookie');

    // Delete a cookie
    this.cookieService.delete('myCookie');

    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.showChatButton = this.isLoggedIn;

    this.showWebsiteChat = localStorage.getItem('showWebsiteChat') === 'true';
    this.reloadOnce();
    this.loadUserID()
  }


  loadUserID() {
    this.authService.getData().subscribe(res => {
      this.userId = res.id; 
      if (this.userId !== null) {
        localStorage.setItem('userId', this.userId.toString());
      }
    });
  }
  

  reloadOnce() {
    if (!sessionStorage.getItem('hasReloaded')) {
      sessionStorage.setItem('hasReloaded', 'true');
      location.reload(); 
    }
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  openChat1() {
    this.dialog.open(ChatWebsitePopUPComponent, {
      width: '450px',
      position: { bottom: '20px', right: '20px' }, // Adjusted position for better visibility
      panelClass: 'custom-chat-popup',
    });
  }
  
  openChat() {
    const dialogRef = this.dialog.open(ChatPopupComponent, {
      width: '450px',
      position: { bottom: '20px', right: '20px' }, // Adjusted position for better visibility
      panelClass: 'custom-chat-popup',
    });
   
  }
  
  closeChat() {
    this.showChatButton = true; // Show floating button
    localStorage.setItem('showChatButton', JSON.stringify(true)); // Save to localStorage
  }
}

