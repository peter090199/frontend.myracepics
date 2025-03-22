import { Component,OnInit  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { MessengerChatComponent } from './messenger-chat/messenger-chat.component';
import { MatDialog } from '@angular/material/dialog';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChatPopupComponent } from './ComponentUI/messages/chat-popup/chat-popup.component';
import { ChatWebsitePopUPComponent } from './ComponentUI/messages/chat-website-pop-up/chat-website-pop-up.component';
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

  constructor(private translate: TranslateService,public dialog: MatDialog,
    private cookieService: CookieService
  ) {
    translate.addLangs(['en', 'fr']); // Add other languages as needed
    translate.setDefaultLang('en');   // Set the default language
  }
  
  ngOnInit(): void {
    this.cookieService.set('myCookie', 'cookieValue', { expires: 7, path: '/' });
    // Get a cookie
    const myCookieValue = this.cookieService.get('myCookie');

    // Delete a cookie
    this.cookieService.delete('myCookie');

    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.showChatButton = this.isLoggedIn;

    this.showWebsiteChat = localStorage.getItem('showWebsiteChat') === 'true';
    this.reloadOnce();
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

