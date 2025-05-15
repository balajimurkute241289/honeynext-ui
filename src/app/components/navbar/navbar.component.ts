import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  cartItems: { id: number; name: string; price: number; quantity: number }[] = [];
  searchQuery: string = '';
  isRegister: boolean = false;

  constructor(private cartService: CartService, private http: HttpClient, private router: Router) {
    this.cartItems = this.cartService.getCart();
  }

  toggleRegister(): void {
    this.isRegister = !this.isRegister;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.http.get<any[]>('http://localhost:8080/api/products/search?query=${encodeURIComponent(this.searchQuery)}').subscribe({
        next: (products) => {
          this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
          this.searchQuery = '';
        },
        error: (error) => {
          console.error('Search error:', error);
          this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
          this.searchQuery = '';
        }
      });
    }
  }

  removeItem(itemId: number): void {
    this.cartService.removeItem(itemId);
    this.cartItems = this.cartService.getCart();
  }
}