import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h2>Settings</h2>
      </div>

      <div class="settings-grid">
        <div class="settings-card">
          <h3>Admin Profile</h3>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="adminProfile.fullName" class="form-input">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="adminProfile.email" class="form-input">
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" [(ngModel)]="adminProfile.phone" class="form-input">
          </div>
          <button class="btn-save" (click)="saveProfile()">Save Profile</button>
        </div>

        <div class="settings-card">
          <h3>Change Password</h3>
          <div class="form-group">
            <label>Current Password</label>
            <input type="password" [(ngModel)]="passwordForm.currentPassword" class="form-input">
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" [(ngModel)]="passwordForm.newPassword" class="form-input">
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" [(ngModel)]="passwordForm.confirmPassword" class="form-input">
          </div>
          <button class="btn-save" (click)="changePassword()">Change Password</button>
        </div>

        <div class="settings-card">
          <h3>System Configuration</h3>
          <div class="form-group">
            <label>
              <input type="checkbox" [(ngModel)]="systemConfig.emailNotifications">
              Enable Email Notifications
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" [(ngModel)]="systemConfig.autoSync">
              Enable Auto Sync
            </label>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" [(ngModel)]="systemConfig.maintenanceMode">
              Maintenance Mode
            </label>
          </div>
          <button class="btn-save" (click)="saveSystemConfig()">Save Configuration</button>
        </div>

        <div class="settings-card">
          <h3>Security Settings</h3>
          <div class="form-group">
            <label>Two-Factor Authentication</label>
            <select [(ngModel)]="securitySettings.twoFactorAuth" class="form-input">
              <option value="disabled">Disabled</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          <div class="form-group">
            <label>Session Timeout (minutes)</label>
            <input type="number" [(ngModel)]="securitySettings.sessionTimeout" class="form-input">
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" [(ngModel)]="securitySettings.ipWhitelist">
              Enable IP Whitelist
            </label>
          </div>
          <button class="btn-save" (click)="saveSecuritySettings()">Save Security Settings</button>
        </div>

        <div class="settings-card full-width">
          <h3>Danger Zone</h3>
          <div class="danger-section">
            <p>These actions cannot be undone. Please proceed with caution.</p>
            <button class="btn-danger" (click)="clearCache()">Clear Cache</button>
            <button class="btn-danger" (click)="resetSystem()">Reset System</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 20px;
      background: #f5f5f5;
      min-height: 100vh;
    }
    .settings-header {
      margin-bottom: 30px;
    }
    .settings-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }
    .settings-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .settings-card.full-width {
      grid-column: 1 / -1;
    }
    .settings-card h3 {
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #333;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }
    .form-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    .form-group input[type="checkbox"] {
      margin-right: 8px;
      cursor: pointer;
    }
    .btn-save {
      width: 100%;
      padding: 10px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      margin-top: 10px;
    }
    .btn-save:hover {
      background: #5568d3;
    }
    .danger-section {
      padding: 15px;
      background: #fff5f5;
      border-left: 4px solid #dc3545;
      border-radius: 4px;
    }
    .danger-section p {
      margin: 0 0 15px 0;
      color: #666;
      font-size: 14px;
    }
    .btn-danger {
      padding: 10px 15px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .btn-danger:hover {
      background: #c82333;
    }
  `]
})
export class SettingsComponent implements OnInit {
  adminEmail = '';
  
  adminProfile = {
    fullName: '',
    email: '',
    phone: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  systemConfig = {
    emailNotifications: true,
    autoSync: true,
    maintenanceMode: false
  };

  securitySettings = {
    twoFactorAuth: 'email',
    sessionTimeout: 30,
    ipWhitelist: false
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.adminEmail = localStorage.getItem('adminEmail') || '';
    this.loadSettings();
  }

  loadSettings() {
    if (this.adminEmail) {
      this.http.get<any>(`${environment.apiUrl}/settings/admin/${this.adminEmail}`).subscribe({
        next: (data) => {
          this.adminProfile.email = data.email;
        },
        error: (err) => console.error('Error loading settings:', err)
      });
    }
  }

  saveProfile() {
    this.http.put(`${environment.apiUrl}/settings/admin/${this.adminEmail}/profile`, this.adminProfile).subscribe({
      next: () => alert('Profile saved successfully!'),
      error: (err) => console.error('Error saving profile:', err)
    });
  }

  changePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    this.http.put(`${environment.apiUrl}/settings/admin/${this.adminEmail}/password`, {
      newPassword: this.passwordForm.newPassword
    }).subscribe({
      next: () => {
        alert('Password changed successfully!');
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
      },
      error: (err) => console.error('Error changing password:', err)
    });
  }

  saveSystemConfig() {
    this.http.put(`${environment.apiUrl}/settings/system`, this.systemConfig).subscribe({
      next: () => alert('System configuration saved successfully!'),
      error: (err) => console.error('Error saving system config:', err)
    });
  }

  saveSecuritySettings() {
    this.http.put(`${environment.apiUrl}/settings/system`, this.securitySettings).subscribe({
      next: () => alert('Security settings saved successfully!'),
      error: (err) => console.error('Error saving security settings:', err)
    });
  }

  clearCache() {
    if (confirm('Are you sure you want to clear the cache?')) {
      this.http.post(`${environment.apiUrl}/settings/cache/clear`, {}).subscribe({
        next: () => alert('Cache cleared successfully!'),
        error: (err) => console.error('Error clearing cache:', err)
      });
    }
  }

  resetSystem() {
    if (confirm('Are you sure you want to reset the system? This action cannot be undone!')) {
      this.http.post(`${environment.apiUrl}/settings/system/reset`, {}).subscribe({
        next: () => alert('System reset initiated!'),
        error: (err) => console.error('Error resetting system:', err)
      });
    }
  }
}
