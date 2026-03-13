import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface ChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-container">
      <div class="reports-header">
        <h2>Reports & Analytics</h2>
      </div>

      <div class="reports-grid">
        <div class="report-card">
          <h3>Total Invoices per Vendor</h3>
          <div class="chart-placeholder">
            <div class="bar-chart">
              @for (item of invoicesPerVendor(); track item.label) {
                <div class="bar-item">
                  <div class="bar-label">{{ item.label }}</div>
                  <div class="bar-container">
                    <div class="bar" [style.width.%]="(item.value / getMaxValue(invoicesPerVendor())) * 100"></div>
                  </div>
                  <div class="bar-value">{{ item.value }}</div>
                </div>
              }
              @empty {
                <p style="text-align: center; color: #999;">No data available</p>
              }
            </div>
          </div>
        </div>

        <div class="report-card">
          <h3>Most Scanned Products</h3>
          <div class="chart-placeholder">
            <div class="product-list">
              @for (product of mostScannedProducts(); track product.label) {
                <div class="product-item">
                  <span class="product-name">{{ product.label }}</span>
                  <span class="product-count">{{ product.value }} scans</span>
                </div>
              }
              @empty {
                <p style="text-align: center; color: #999;">No data available</p>
              }
            </div>
          </div>
        </div>

        <div class="report-card full-width">
          <h3>Monthly Invoice Activity</h3>
          <div class="chart-placeholder">
            <div class="line-chart">
              @for (month of monthlyActivity(); track month.label) {
                <div class="month-item">
                  <div class="month-label">{{ month.label }}</div>
                  <div class="month-bar" [style.height.%]="(month.value / getMaxValue(monthlyActivity())) * 100"></div>
                  <div class="month-value">{{ month.value }}</div>
                </div>
              }
              @empty {
                <p style="text-align: center; color: #999;">No data available</p>
              }
            </div>
          </div>
        </div>
      </div>

      <div class="summary-section">
        <h3>Summary Statistics</h3>
        <div class="summary-grid">
          <div class="summary-card">
            <div class="summary-label">Total Vendors</div>
            <div class="summary-value">{{ totalVendors() }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total Invoices</div>
            <div class="summary-value">{{ totalInvoices() }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total Products Scanned</div>
            <div class="summary-value">{{ totalProductsScanned() }}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Average Invoice Value</div>
            <div class="summary-value">₹{{ averageInvoiceValue() | number:'1.0-0' }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 20px;
      background: #f5f5f5;
      min-height: 100vh;
    }
    .reports-header {
      margin-bottom: 30px;
    }
    .reports-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .report-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .report-card.full-width {
      grid-column: 1 / -1;
    }
    .report-card h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #333;
    }
    .chart-placeholder {
      min-height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bar-chart {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .bar-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .bar-label {
      width: 100px;
      font-size: 12px;
      color: #666;
    }
    .bar-container {
      flex: 1;
      height: 30px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
    }
    .bar-value {
      width: 40px;
      text-align: right;
      font-size: 12px;
      font-weight: 600;
      color: #333;
    }
    .product-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .product-name {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
    .product-count {
      font-size: 12px;
      color: #667eea;
      font-weight: 600;
    }
    .line-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 200px;
      gap: 10px;
    }
    .month-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
    }
    .month-label {
      font-size: 12px;
      color: #666;
    }
    .month-bar {
      width: 100%;
      background: linear-gradient(180deg, #667eea, #764ba2);
      border-radius: 4px 4px 0 0;
      min-height: 20px;
    }
    .month-value {
      font-size: 12px;
      font-weight: 600;
      color: #333;
    }
    .summary-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .summary-section h3 {
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #333;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    .summary-card {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .summary-label {
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 10px;
    }
    .summary-value {
      font-size: 28px;
      font-weight: 700;
    }
  `]
})
export class ReportsComponent implements OnInit {
  invoicesPerVendor = signal<ChartData[]>([]);
  mostScannedProducts = signal<ChartData[]>([]);
  monthlyActivity = signal<ChartData[]>([]);
  totalVendors = signal(0);
  totalInvoices = signal(0);
  totalProductsScanned = signal(0);
  averageInvoiceValue = signal(0);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReportData();
  }

  loadReportData() {
    this.http.get<any>(`${environment.apiUrl}/reports/analytics`).subscribe({
      next: (data) => {
        this.totalVendors.set(data.totalVendors);
        this.totalInvoices.set(data.totalInvoices);
        this.totalProductsScanned.set(data.totalProductsScanned);
        this.averageInvoiceValue.set(data.averageInvoiceValue);
        
        // Convert invoicesPerVendor map to array
        const vendorArray = Object.entries(data.invoicesPerVendor || {}).map(([key, value]) => ({
          label: key,
          value: value as number
        }));
        this.invoicesPerVendor.set(vendorArray);
        
        // Convert mostScannedProducts
        const productsArray = (data.mostScannedProducts || []).map((p: any) => ({
          label: p.name,
          value: p.scans
        }));
        this.mostScannedProducts.set(productsArray);
        
        // Convert monthlyActivity
        const monthlyArray = (data.monthlyActivity || []).map((m: any) => ({
          label: m.month,
          value: m.invoices
        }));
        this.monthlyActivity.set(monthlyArray);
      },
      error: (err) => console.error('Error loading reports:', err)
    });
  }

  getMaxValue(data: ChartData[]): number {
    return Math.max(...data.map(d => d.value), 1);
  }
}
