import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  status: 'In Stock' | 'Sold Out';
  category: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['All', 'Honey', 'Combos', 'Ayurvedic'];
  selectedCategory: string = 'All';
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.http.get<Product[]>('http://localhost:8080/api/products').subscribe({
      next: (products) => {
        this.products = products.map(product => ({
          ...product,
          image: product.image || 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg' // Fallback if API image is missing
        }));
        this.filterProducts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        // Fallback mock data with verified Pexels images
        this.products = [
          { id: 1, name: 'Pure Himalayan Honey', price: 499, image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg', status: 'In Stock', category: 'Honey' },
          { id: 2, name: 'Organic Wild Honey', price: 599, image: 'https://images.pexels.com/photos/4194005/pexels-photo-4194005.jpeg', status: 'In Stock', category: 'Honey' },
          { id: 3, name: 'Honey Comb', price: 799, image: 'https://images.pexels.com/photos/3825674/pexels-photo-3825674.jpeg', status: 'Sold Out', category: 'Combos' },
          { id: 4, name: 'Ayurvedic Honey', price: 449, image: 'https://images.pexels.com/photos/5946103/pexels-photo-5946103.jpeg', status: 'In Stock', category: 'Ayurvedic' }
        ];
        this.filterProducts();
        this.isLoading = false;
        this.errorMessage = 'Unable to fetch products from server. Showing sample products.';
      }
    });
  }

  filterProducts(): void {
    let filtered = [...this.products];
    if (this.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }
    this.filteredProducts = filtered;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filterProducts();
  }

  addToCart(product: Product): void {
    if (product.status === 'In Stock') {
      this.cartService.addToCart({ id: product.id, name: product.name, price: product.price });
      alert(`${product.name} added to cart!`);
    } else {
      alert('This product is sold out.');
    }
  }

  handleImageError(event: Event, product: Product): void {
    (event.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg';
  }
}