import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  get cartItems(): any[] {
    return this.cartItemsSubject.value;
  }

  /* ADD TO CART (increase qty if exists) */
  addToCart(item: any): void {
    const items = [...this.cartItems];
    const index = items.findIndex(i => i.id === item.id);

    if (index > -1) {
      items[index].qty += 1; // 🔥 Shopee behavior
    } else {
      items.push({
        ...item,
        qty: 1
      });
    }

    this.cartItemsSubject.next(items);
  }

  /* DECREASE QTY */
  decreaseQty(itemId: number): void {
    const items = [...this.cartItems];
    const index = items.findIndex(i => i.id === itemId);

    if (index > -1) {
      items[index].qty -= 1;

      if (items[index].qty <= 0) {
        items.splice(index, 1);
      }
    }

    this.cartItemsSubject.next(items);
  }

  /* REMOVE ITEM COMPLETELY */
  removeFromCart(itemId: number): void {
    this.cartItemsSubject.next(
      this.cartItems.filter(i => i.id !== itemId)
    );
  }

  /* CLEAR CART */
  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  /* TOTAL COUNT (for badge) */
  getTotalCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.qty, 0);
  }

  /* TOTAL PRICE (optional) */
  getTotalPrice(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.qty,
      0
    );
  }
}

// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { _url } from 'src/global-variables';

// @Injectable({ providedIn: 'root' })
// export class ImagesService {

//   private cartSubject = new BehaviorSubject<any[]>([]);
//   cart$ = this.cartSubject.asObservable();

//   private API = 'http://localhost:8000/api/cart';

//   constructor(private http: HttpClient) {}

//   /* LOAD CART FROM LARAVEL */
//   loadCart(): void {
//     this.http.get<any[]>(_url).subscribe(items => {
//       this.cartSubject.next(items);
//     });
//   }

//   /* ADD ITEM */
//   addToCart(item: any): void {
//     this.http.post(`${_url}add`, {
//       product_id: item.id
//     }).subscribe(() => this.loadCart());
//   }

//   /* DECREASE */
//   decreaseQty(productId: number): void {
//     this.http.post(`${_url}decrease`, {
//       product_id: productId
//     }).subscribe(() => this.loadCart());
//   }

//   /* REMOVE */
//   removeFromCart(productId: number): void {
//     this.http.post(`${_url}remove`, {
//       product_id: productId
//     }).subscribe(() => this.loadCart());
//   }

//   /* TOTAL COUNT (BADGE) */
//   getTotalCount(): number {
//     return this.cartSubject.value.reduce(
//       (sum, item) => sum + item.qty, 0
//     );
//   }
// }

