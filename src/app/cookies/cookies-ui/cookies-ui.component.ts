import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookies-ui',
  templateUrl: './cookies-ui.component.html',
  styleUrls: ['./cookies-ui.component.css']
})
export class CookiesUIComponent implements OnInit {
  showCookieConsent: boolean = false;

  ngOnInit(): void {
    this.checkCookieConsent();
  //  this.showCookieConsent = localStorage.getItem('cookieAccepted') !== 'true';
  }

  // Check if the user has already accepted or rejected cookies
  checkCookieConsent(): void {
    if (!localStorage.getItem("cookiesAccepted") && !localStorage.getItem("cookiesRejected")) {
      this.showCookieConsent = true;
    }
  }

  // Handle acceptance of cookies
  acceptCookies(): void {
    localStorage.setItem("cookiesAccepted", "true");
    localStorage.removeItem("cookiesRejected"); // Clear rejection status
    this.setCookies(); // Function to set cookies after user acceptance
    this.showCookieConsent = false;

    localStorage.setItem("showWebsiteChat", "true");
    location.reload();
  }

  // Handle rejection of cookies
  rejectCookies(): void {
    localStorage.setItem("cookiesRejected", "true");
    localStorage.removeItem("cookiesAccepted"); // Clear acceptance status
    localStorage.removeItem("showWebsiteChat"); 
    this.clearCookies(); // Function to clear cookies after user rejection
    this.showCookieConsent = false;
  }

  // Function to set cookies after acceptance (for example, analytics cookies)
  setCookies(): void {
    // Set necessary cookies for the application (e.g., for analytics or preferences)
    // Example:
    document.cookie = "userPreferences=accepted; path=/; max-age=31536000"; // 1 year
  }

  clearCookies(): void {
    const pastDate = new Date(0).toUTCString();  // Using the Unix epoch time (January 1, 1970)
  
    // Clear any cookies that have been set before the user rejected cookies
    document.cookie = "userPreferences=; path=/; expires=" + pastDate;  // Example cookie
    document.cookie = "analyticsCookies=; path=/; expires=" + pastDate;  // Example cookie
    document.cookie = "otherCookie=; path=/; expires=" + pastDate;  // Add more cookies as needed
  }
  

  // Redirect to the cookie settings page (if needed)
  manageCookies(): void {
    window.location.href = "/cookie-settings"; // Redirect to cookie settings page
  }
}
