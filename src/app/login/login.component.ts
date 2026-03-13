import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Admin Login</h1>
          <p>Enter your credentials to access the admin dashboard</p>
        </div>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required class="form-input" placeholder="admin@example.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required class="form-input" placeholder="Enter password" />
          </div>
          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }
          <button type="submit" class="btn-primary" [disabled]="loading()">
            {{ loading() ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-header h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .auth-header p {
      color: #6b7280;
      font-size: 14px;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      font-size: 14px;
    }
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
    }
    .form-input:focus {
      outline: none;
      border-color: #667eea;
    }
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
    }
    .btn-primary:hover {
      background: #5568d3;
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .error-message {
      background: #fee;
      color: #c33;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 14px;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.loading.set(true);
    this.error.set('');

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post(`${environment.apiUrl}/auth/login`, loginData).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        console.log('Admin login response:', response);
        
        if (response.success) {
          localStorage.setItem('adminEmail', this.email);
          localStorage.setItem('userType', '1');
          localStorage.setItem('token', response.token);
          localStorage.setItem('userName', response.name || 'Admin');
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set(response.message || 'Login failed');
        }
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Login error:', error);
        
        if (error.status === 403) {
          this.error.set('Access denied. Only admin users can login here.');
        } else if (error.status === 400) {
          this.error.set(error.error?.message || 'Invalid email or password');
        } else {
          this.error.set('Login failed. Please try again.');
        }
      }
    });
  }
}
