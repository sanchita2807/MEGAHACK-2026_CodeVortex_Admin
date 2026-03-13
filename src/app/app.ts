import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Scan {
  vendor: string;
  date: string;
  status: string;
  items: number;
  amount: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {
  protected readonly title = signal('admin-panel');
  protected readonly isScanning = signal(false);
  
  protected readonly recentScans = signal<Scan[]>([
    { vendor: 'Kamala Distributors', date: 'Today, 10:42 AM', status: 'Auto-Synced', items: 24, amount: '14,500' },
    { vendor: 'Roy Traders (Handwritten)', date: 'Today, 09:15 AM', status: 'Needs Review', items: 18, amount: '8,250' },
    { vendor: 'Metro Wholesale', date: 'Yesterday, 04:30 PM', status: 'Auto-Synced', items: 45, amount: '32,100' },
    { vendor: 'Gupta Spices', date: 'Yesterday, 02:10 PM', status: 'Auto-Synced', items: 12, amount: '4,800' }
  ]);

  simulateScan() {
    if (this.isScanning()) return;
    
    this.isScanning.set(true);
    
    setTimeout(() => {
      this.isScanning.set(false);
      
      const newScan: Scan = {
        vendor: 'New Vendor Ltd.',
        date: 'Just now',
        status: 'Auto-Synced',
        items: Math.floor(Math.random() * 50) + 1,
        amount: (Math.random() * 50000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      };
      
      this.recentScans.update((scans: Scan[]) => [newScan, ...scans]);
    }, 2500);
  }
}
