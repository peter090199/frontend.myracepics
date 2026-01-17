// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-view-cart-check-out',
//   templateUrl: './view-cart-check-out.component.html',
//   styleUrls: ['./view-cart-check-out.component.css']
// })
// export class ViewCartCheckOutComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { ProfileEventComponent } from '../../profile-event/profile-event.component';

@Component({
  selector: 'app-view-cart-check-out',
  templateUrl: './view-cart-check-out.component.html',
  styleUrls: ['./view-cart-check-out.component.css']
})
export class ViewCartCheckOutComponent implements OnInit {

  cart: any[] = [];

  constructor(private eventprofile: ProfileEventComponent) { }

  ngOnInit(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
  }

  // Calculate total price
  getCartTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price, 0);
  }

  // Remove item from cart
  removeFromCart(event: Event) {
    // this.cart = this.cart.filter(e => e.id !== event.id);
    // localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  checkout() {
    console.log('Proceed to checkout', this.cart);
    // Redirect to payment page or process payment
  }
}
