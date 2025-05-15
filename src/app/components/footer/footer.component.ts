import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  email: string = '';

  constructor(private http: HttpClient) {}

  onSubscribe(): void {
    if (this.email) {
      this.http.post('http://localhost:8080/api/subscribe', { email: this.email }).subscribe({
        next: () => {
          alert('Thank you for subscribing to our broadcast group!');
          this.email = '';
        },
        error: (error) => {
          alert(`Error: ${error.message}`);
        }
      });
    } else {
      alert('Please enter a valid email address.');
    }
  }
}