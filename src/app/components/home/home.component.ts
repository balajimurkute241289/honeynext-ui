import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  status: 'In Stock' | 'Sold Out';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  featuredProducts: Product[] = [];

  constructor(private http: HttpClient, private cartService: CartService) {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.http.get<Product[]>('http://localhost:8080/api/products').subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 4).map(product => ({
          ...product,
          image: product.image || 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg'
        }));
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        // Fallback mock data with verified Pexels images
        this.featuredProducts = [
          { id: 1, name: 'Pure Himalayan Honey', price: 499, image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg', status: 'In Stock' },
          { id: 2, name: 'Organic Wild Honey', price: 599, image: 'https://images.pexels.com/photos/4194005/pexels-photo-4194005.jpeg', status: 'In Stock' },
          { id: 3, name: 'Honey Comb', price: 799, image: 'https://images.pexels.com/photos/3825674/pexels-photo-3825674.jpeg', status: 'Sold Out' },
          { id: 4, name: 'Ayurvedic Honey', price: 449, image: 'https://images.pexels.com/photos/5946103/pexels-photo-5946103.jpeg', status: 'In Stock' }
        ];
      }
    });
  }

  addToCart(product: Product): void {
    if (product.status === 'In Stock') {
      this.cartService.addToCart({ id: product.id, name: product.name, price: product.price });
      alert(`${product.name} added to cart!`);
    } else {
      alert('This product is sold out.');
    }
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg';
  }
}