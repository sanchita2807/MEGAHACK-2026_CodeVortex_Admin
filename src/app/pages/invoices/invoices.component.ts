import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Invoice {
  id: number;
  vendorName: string;
  invoiceDate: string;
  numberOfItems: number;
  totalAmount: number;
}

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="invoices-container">
      <div class="invoices-header">
        <h2>Invoices</h2>
        <div class="filter-section">
          <input type="date" class="filter-input" placeholder="From Date">
          <input type="date" class="filter-input" placeholder="To Date">
          <button class="btn-filter">Filter</button>
        </div>
      </div>

      <div class="invoices-table-wrapper">
        <table class="invoices-table">
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Invoice Date</th>
              <th>Number of Items</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (invoice of invoices(); track invoice.id) {
              <tr>
                <td>{{ invoice.vendorName }}</td>
                <td>{{ invoice.invoiceDate }}</td>
                <td>{{ invoice.numberOfItems }}</td>
                <td>₹{{ invoice.totalAmount.toLocaleString('en-IN') }}</td>
                <td>
                  <button class="btn-view-details" (click)="viewInvoiceDetails(invoice.id)">View Details</button>
                </td>
              </tr>
            }
            @empty {
              <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: #999;">
                  No invoices found
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .invoices-container {
      padding: 20px;
      background: #f5f5f5;
      min-height: 100vh;
    }
    .invoices-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }
    .invoices-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    .filter-section {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .filter-input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .btn-filter {
      padding: 8px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-filter:hover {
      background: #5568d3;
    }
    .invoices-table-wrapper {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .invoices-table {
      width: 100%;
      border-collapse: collapse;
    }
    .invoices-table thead {
      background: #f8f9fa;
      border-bottom: 2px solid #e9ecef;
    }
    .invoices-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      color: #495057;
      font-size: 14px;
    }
    .invoices-table td {
      padding: 15px;
      border-bottom: 1px solid #e9ecef;
      color: #333;
    }
    .invoices-table tbody tr:hover {
      background: #f8f9fa;
    }
    .btn-view-details {
      padding: 6px 12px;
      background: #17a2b8;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
    }
    .btn-view-details:hover {
      background: #138496;
    }
  `]
})
export class InvoicesComponent implements OnInit {
  invoices = signal<Invoice[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.http.get<Invoice[]>(`${environment.apiUrl}/invoices`).subscribe({
      next: (data) => this.invoices.set(data),
      error: (err) => console.error('Error loading invoices:', err)
    });
  }

  viewInvoiceDetails(id: number) {
    alert(`Viewing details for invoice ${id}`);
  }
}
