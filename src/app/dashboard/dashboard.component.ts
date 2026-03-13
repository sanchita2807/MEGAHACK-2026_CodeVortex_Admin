import { Component, signal, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService, DashboardStats, InvoiceDTO, ProductDTO } from '../services/dashboard.service';
import { LanguageService, Language } from '../services/language.service';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['../app.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit {
  isScanning = signal(false);
  recentScans = signal<InvoiceDTO[]>([]);
  lowStockProducts = signal<ProductDTO[]>([]);
  stats = signal<DashboardStats>({
    totalItems: 0,
    lowStockAlerts: 0,
    invoicesScanned: 0,
    totalInventoryValue: 0
  });
  currentRoute = 'dashboard';
  adminEmail = '';
  languages = signal<Language[]>([]);
  selectedLanguage = signal<string>('en');
  showLanguageMenu = signal(false);

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private languageService: LanguageService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.adminEmail = localStorage.getItem('adminEmail') || 'Admin';
    this.selectedLanguage.set(this.languageService.getCurrentLanguage());
    this.loadLanguages();
    this.loadDashboardData();
  }

  loadLanguages() {
    this.languageService.getLanguages().subscribe({
      next: (data) => this.languages.set(data),
      error: (err) => console.error('Error loading languages:', err)
    });
  }

  toggleLanguageMenu() {
    this.showLanguageMenu.update(v => !v);
  }

  selectLanguage(code: string) {
    this.languageService.setLanguage(code);
    this.translationService.setLanguage(code);
    this.selectedLanguage.set(code);
    this.showLanguageMenu.set(false);
  }

  getLanguageDisplay(): string {
    const lang = this.languages().find(l => l.code === this.selectedLanguage());
    return lang ? `${lang.name} / ${lang.nativeName}` : 'English / हिन्दी';
  }

  loadDashboardData() {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error loading stats:', err)
    });

    this.dashboardService.getRecentInvoices().subscribe({
      next: (data) => this.recentScans.set(data),
      error: (err) => console.error('Error loading invoices:', err)
    });

    this.dashboardService.getLowStockProducts().subscribe({
      next: (data) => this.lowStockProducts.set(data),
      error: (err) => console.error('Error loading low stock:', err)
    });
  }

  simulateScan() {
    this.isScanning.set(true);
    
    const newInvoice: InvoiceDTO = {
      vendor: 'New Vendor Ltd.',
      date: 'Just now',
      status: 'Auto-Synced',
      items: Math.floor(Math.random() * 30) + 10,
      amount: (Math.random() * 20000 + 5000).toFixed(0)
    };

    setTimeout(() => {
      this.dashboardService.simulateScan(newInvoice).subscribe({
        next: (savedInvoice) => {
          this.isScanning.set(false);
          this.recentScans.update(scans => [savedInvoice, ...scans]);
          this.stats.update(s => ({
            ...s,
            invoicesScanned: s.invoicesScanned + 1
          }));
        },
        error: (err) => {
          this.isScanning.set(false);
          console.error('Error scanning invoice:', err);
        }
      });
    }, 3000);
  }

  navigateTo(route: string) {
    this.currentRoute = route.substring(1);
    this.router.navigate([route]);
  }

  exportToExcel() {
    this.dashboardService.exportToExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-${new Date().getTime()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error exporting to Excel:', err)
    });
  }

  syncWithTally() {
    this.dashboardService.syncWithTally().subscribe({
      next: (response) => {
        alert(response.message);
        this.loadDashboardData();
      },
      error: (err) => console.error('Error syncing with Tally:', err)
    });
  }

  exportReport() {
    this.dashboardService.exportReport().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-report-${new Date().getTime()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error exporting report:', err)
    });
  }

  generateReorderList() {
    this.dashboardService.generateReorderList().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reorder-list-${new Date().getTime()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error generating reorder list:', err)
    });
  }

  toggleUserMenu() {
    // Can implement dropdown menu here
  }

  logout() {
    localStorage.removeItem('adminEmail');
    this.router.navigate(['/login']);
  }
}
