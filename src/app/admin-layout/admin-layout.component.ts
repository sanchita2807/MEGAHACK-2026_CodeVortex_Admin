import { Component, signal, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { LanguageService, Language } from '../services/language.service';
import { TranslationService } from '../services/translation.service';
import { NotificationService, Notification } from '../services/notification.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslatePipe],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['../app.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminLayoutComponent implements OnInit {
  currentRoute = 'dashboard';
  adminEmail = '';
  languages = signal<Language[]>([]);
  selectedLanguage = signal<string>('en');
  showLanguageMenu = signal(false);
  showNotificationMenu = signal(false);
  notifications = signal<Notification[]>([]);
  unreadCount = signal<number>(0);

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private translationService: TranslationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.adminEmail = localStorage.getItem('adminEmail') || 'Admin';
    this.selectedLanguage.set(this.languageService.getCurrentLanguage());
    this.loadLanguages();
    this.updateCurrentRoute();
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.selectedLanguage.set(lang);
    });

    // Subscribe to notifications
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications.set(notifications);
    });

    // Subscribe to unread count
    this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadCount.set(count);
    });

    // Add sample notifications
    this.addSampleNotifications();
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
    return lang ? `${lang.name} / ${lang.nativeName}` : 'English / English';
  }

  toggleNotificationMenu() {
    this.showNotificationMenu.update(v => !v);
  }

  markNotificationAsRead(id: string) {
    this.notificationService.markAsRead(id);
  }

  deleteNotification(id: string) {
    this.notificationService.deleteNotification(id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  clearAllNotifications() {
    this.notificationService.clearAll();
  }

  addSampleNotifications() {
    // Add sample notifications on first load
    const stored = localStorage.getItem('notifications');
    if (!stored) {
      this.notificationService.addNotification(
        'Welcome',
        'Welcome to SmartStock Admin Panel',
        'success'
      );
      this.notificationService.addNotification(
        'System Update',
        'System will be updated tonight at 2 AM',
        'info'
      );
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'lucide:check-circle';
      case 'error':
        return 'lucide:alert-circle';
      case 'warning':
        return 'lucide:alert-triangle';
      default:
        return 'lucide:info';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  }

  navigateTo(route: string) {
    this.currentRoute = route.substring(1);
    this.router.navigate([route]);
  }

  updateCurrentRoute() {
    const url = this.router.url;
    this.currentRoute = url.substring(1).split('/')[0] || 'dashboard';
  }

  toggleUserMenu() {
    // Can implement dropdown menu here
  }

  logout() {
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }
}
