import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardStats {
  totalItems: number;
  lowStockAlerts: number;
  invoicesScanned: number;
  totalInventoryValue: number;
}

export interface InvoiceDTO {
  id?: number;
  vendor: string;
  date: string;
  status: string;
  items: number;
  amount: string;
}

export interface ProductDTO {
  id: number;
  name: string;
  stockLeft: number;
  minStock: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8083/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getRecentInvoices(): Observable<InvoiceDTO[]> {
    return this.http.get<InvoiceDTO[]>(`${this.apiUrl}/invoices`);
  }

  getLowStockProducts(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.apiUrl}/low-stock`);
  }

  simulateScan(invoice: InvoiceDTO): Observable<InvoiceDTO> {
    return this.http.post<InvoiceDTO>(`${this.apiUrl}/scan`, invoice);
  }

  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/excel`, { responseType: 'blob' });
  }

  syncWithTally(): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(`${this.apiUrl}/sync/tally`, {});
  }

  exportReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/report`, { responseType: 'blob' });
  }

  generateReorderList(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reorder-list`, { responseType: 'blob' });
  }
}
