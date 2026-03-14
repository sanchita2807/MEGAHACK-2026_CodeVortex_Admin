import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface User {
  id: number;
  name: string;
  shopName: string;
  phone: string;
  status: 'approved' | 'pending' | 'blocked';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-container">
      <div class="users-header">
        <h2>Users Management</h2>
        <button class="btn-primary">Add Vendor</button>
      </div>

      <div class="users-table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Shop Name</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr>
                <td>{{ user.name }}</td>
                <td>{{ user.shopName }}</td>
                <td>{{ user.phone }}</td>
                <td>
                  <span [class]="'status-badge status-' + user.status.toLowerCase()">
                    {{ user.status | uppercase }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    @if (user.status.toLowerCase() === 'pending') {
                      <button class="btn-approve" (click)="approveUser(user.id)">Approve</button>
                    }
                    @if (user.status.toLowerCase() !== 'blocked') {
                      <button class="btn-block" (click)="blockUser(user.id)">Block</button>
                    }
                    <button class="btn-view" (click)="viewDetails(user.id)">View</button>
                  </div>
                </td>
              </tr>
            }
            @empty {
              <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: #999;">
                  No users found
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 20px;
      background: #f5f5f5;
      min-height: 100vh;
    }
    .users-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .users-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    .btn-primary {
      padding: 10px 20px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-primary:hover {
      background: #5568d3;
    }
    .users-table-wrapper {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .users-table {
      width: 100%;
      border-collapse: collapse;
    }
    .users-table thead {
      background: #f8f9fa;
      border-bottom: 2px solid #e9ecef;
    }
    .users-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #495057;
      font-size: 14px;
    }
    .users-table td {
      padding: 15px;
      border-bottom: 1px solid #e9ecef;
      color: #333;
    }
    .users-table tbody tr:hover {
      background: #f8f9fa;
    }
    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-approved {
      background: #d4edda;
      color: #155724;
    }
    .status-pending {
      background: #fff3cd;
      color: #856404;
    }
    .status-blocked {
      background: #f8d7da;
      color: #721c24;
    }
    .action-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn-approve, .btn-block, .btn-view {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
    }
    .btn-approve {
      background: #28a745;
      color: white;
    }
    .btn-approve:hover {
      background: #218838;
    }
    .btn-block {
      background: #dc3545;
      color: white;
    }
    .btn-block:hover {
      background: #c82333;
    }
    .btn-view {
      background: #17a2b8;
      color: white;
    }
    .btn-view:hover {
      background: #138496;
    }
  `]
})
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<User[]>(`${environment.apiUrl}/vendors`).subscribe({
      next: (data) => this.users.set(data),
      error: (err) => console.error('Error loading users:', err)
    });
  }

  approveUser(id: number) {
    this.http.put(`${environment.apiUrl}/vendors/${id}/approve`, {}).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Error approving user:', err)
    });
  }

  blockUser(id: number) {
    this.http.put(`${environment.apiUrl}/vendors/${id}/block`, {}).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Error blocking user:', err)
    });
  }

  viewDetails(id: number) {
    alert(`Viewing details for user ${id}`);
  }
}
