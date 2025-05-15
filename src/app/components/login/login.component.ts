import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  user = { username: '', password: '' };
  authMode: 'login' | 'register' = 'login';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    window.addEventListener('authModeChange', (event: any) => {
      this.authMode = event.detail.mode;
    });
  }

  toggleAuthMode(): void {
    this.authMode = this.authMode === 'login' ? 'register' : 'login';
  }

  onSubmit(): void {
    const url = this.authMode === 'login' ? 'http://localhost:8080/api/users/login' : 'http://localhost:8080/api/users/register';
    this.http.post(url, this.user).subscribe({
      next: (response) => {
        alert(`${this.authMode === 'login' ? 'Login' : 'Registration'} successful!`);
      },
      error: (error) => {
        alert(`Error: ${error.message}`);
      }
    });
  }
}