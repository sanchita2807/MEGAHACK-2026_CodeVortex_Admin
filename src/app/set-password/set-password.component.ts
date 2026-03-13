import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Set Your Password</h1>
          <p>Create a secure password for {{ email }}</p>
        </div>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>New Password</label>
            <input type="password" [(ngModel)]="password" name="password" required class="form-input" placeholder="Enter new password" />
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required class="form-input" placeholder="Confirm password" />
          </div>
          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }
          <button type="submit" class="btn-primary" [disabled]="loading()">
            {{ loading() ? 'Setting Password...' : 'Set Password' }}
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
export class SetPasswordComponent implements OnInit {
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.setPassword(this.email, this.password).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          localStorage.setItem('adminEmail', this.email);
          this.router.navigate(['/dashboard']);
        } else {
          this.error.set(response.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Failed to set password. Please try again.');
      }
    });
  }
}
