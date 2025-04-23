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
import { SigInService } from './services/signIn/sig-in.service';
import { InactivityService } from './services/inactivity.service';
import { AuthGuard } from './AuthGuard/auth.guard';

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
    private cookieService: CookieService,private authService: AuthService,private echoService:EchoService,
    private logoutServices: SigInService,private inactivityService:InactivityService,private authguard:AuthGuard

  ) {
    translate.addLangs(['en', 'fr']); // Add other languages as needed
    translate.setDefaultLang('en');   // Set the default language
  }
  
  ngOnInit(): void {
    const user = sessionStorage.getItem('token');
    if (!user) {
      this.authguard.logout();
    }
    
    this.cookieService.set('myCookie', 'cookieValue', { expires: 7, path: '/' });
    const myCookieValue = this.cookieService.get('myCookie');
    this.cookieService.delete('myCookie');

    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.showChatButton = this.isLoggedIn;

    this.showWebsiteChat = localStorage.getItem('chatmessages') === 'true';
    this.reloadOnce();
    this.loadUserID();
    this.inactivityService.startWatching();


    
  }

  onLogout(): void {
    this.logoutServices.logout().subscribe({
      next: () => {
        const showChat = JSON.stringify(false);
        const cookiesAccepted = JSON.stringify(true);
        sessionStorage.clear();
        localStorage.clear();
        localStorage.setItem('showWebsiteChat', showChat);
        localStorage.setItem('cookiesAccepted', cookiesAccepted);
        window.location.href = '/homepage';
      },
      error: (err) => console.error('Logout failed:', err)
    });
  }
  

  loadUserID() {
    this.authService.getData().subscribe(res => {
      this.userId = res.id; 
      if (this.userId !== null) {
        sessionStorage.setItem('userId', this.userId.toString());
      }
    });
    this.load();
  }
  
  notificationCounts: number = 0;
  
  load(){
    this.echoService.notificationCount$.subscribe(counts => {
      this.notificationCounts = counts;
      console.log(this.notificationCounts)
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

